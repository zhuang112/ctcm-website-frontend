import fs from "node:fs";
import path from "node:path";
import { anycontentToWpImportRecord } from "../../src/wp/import/anycontent-to-wp";
import { createWPClient, getConfigFromEnv } from "../../src/wp/rest/client";
import type { WPImportRecord, WPPostType } from "../../src/wp/import/types";

interface CliOptions {
  lang: string;
  postTypes: WPPostType[];
  limit: number | null;
  dryRun: boolean;
  since?: string | null;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    lang: "zh-tw",
    postTypes: ["ct_teaching", "ct_news", "ct_magazine"],
    limit: null,
    dryRun: true,
    since: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--lang" && argv[i + 1]) {
      opts.lang = argv[++i];
    } else if (arg === "--post_type" && argv[i + 1]) {
      const raw = argv[++i];
      if (raw !== "all") {
        opts.postTypes = raw.split(",") as WPPostType[];
      }
    } else if (arg === "--limit" && argv[i + 1]) {
      opts.limit = Number(argv[++i]);
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--push") {
      opts.dryRun = false;
    } else if (arg === "--since" && argv[i + 1]) {
      opts.since = argv[++i];
    }
  }
  return opts;
}

function loadAnycontent(lang: string, postType: string): WPImportRecord[] {
  const dir = path.join("data", "anycontent", lang, postType);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const full = path.join(dir, file);
    const json = JSON.parse(fs.readFileSync(full, "utf8"));
    return anycontentToWpImportRecord(json);
  });
}

function toRestPayload(record: WPImportRecord) {
  return {
    title: record.wp_title,
    status: record.wp_status,
    slug: record.wp_slug ?? undefined,
    content: record.wp_content_html,
    meta: {
      source_external_id: record.source_external_id,
      source_old_url: record.source_old_url,
      source_language: record.source_language,
      default_gallery_style: record.default_gallery_style,
      gallery_items: record.gallery_items,
      gallery_blocks: record.gallery_blocks,
      ...record.meta,
    },
  };
}

async function run() {
  const opts = parseArgs(process.argv);
  const postTypeMap: Record<string, WPPostType> = {
    teaching: "ct_teaching",
    news: "ct_news",
    magazine: "ct_magazine",
  };

  const selectedPostTypes =
    opts.postTypes.length === 3
      ? ["teaching", "news", "magazine"]
      : opts.postTypes.map((p) => {
          if (p === "ct_teaching") return "teaching";
          if (p === "ct_news") return "news";
          return "magazine";
        });

  const records: { type: WPPostType; record: WPImportRecord }[] = [];
  for (const pt of selectedPostTypes) {
    const mapped = loadAnycontent(opts.lang, pt);
    mapped.forEach((rec) => {
      records.push({ type: postTypeMap[pt], record: rec });
    });
  }

  const limited = opts.limit ? records.slice(0, opts.limit) : records;

  console.log(
    `[wp-import-push] lang=${opts.lang} post_types=${selectedPostTypes.join(",")} count=${
      limited.length
    } dryRun=${opts.dryRun}`,
  );

  if (!limited.length) {
    console.log("No records to process.");
    return;
  }

  if (opts.dryRun) {
    limited.forEach((item, idx) => {
      const payload = toRestPayload(item.record);
      console.log(`-- DRY RUN #${idx + 1} -> ${item.type}`);
      console.log(JSON.stringify(payload, null, 2));
    });
    return;
  }

  const client = createWPClient(getConfigFromEnv());

  for (const [idx, item] of limited.entries()) {
    const payload = toRestPayload(item.record);
    try {
      const res = await client.post(`/wp-json/wp/v2/${item.type}`, payload);
      console.log(`PUSHED #${idx + 1} -> ${item.type} id=${(res as any).id ?? "n/a"}`);
    } catch (err) {
      console.error(`Failed to push #${idx + 1} -> ${item.type}: ${(err as Error).message}`);
      throw err;
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
