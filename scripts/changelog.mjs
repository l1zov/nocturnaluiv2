#!/usr/bin/env node
import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const CHANGELOG_PATH = path.join(root, "CHANGELOG.md");

function run(cmd) {
    try {
        return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] })
            .toString()
            .trim();
    } catch (_e) {
        return null;
    }
}

function getPkgVersion() {
    try {
        const pkg = JSON.parse(
            execSync(`cat ${path.join(root, "package.json")}`, {
                encoding: "utf8",
            }),
        );
        return pkg.version || "0.0.0";
    } catch {
        return "0.0.0";
    }
}

function getLastTag() {
    return run("git describe --tags --abbrev=0");
}

// function tagExists(tag) {
//     if (!tag) return false;
//     const exact = run(`git rev-parse -q --verify refs/tags/${tag}`);
//     if (exact) return true;
//     const pref = run(`git rev-parse -q --verify refs/tags/v${tag}`);
//     return !!pref;
// }

function getTagsSorted() {
    const out = run("git tag --list --sort=-creatordate");
    if (!out) return [];
    return out.split("\n").filter(Boolean);
}

function getOriginRepo() {
    const remote = run("git remote get-url origin") || "";
    // git@github.com:user/repo.git OR https://github.com/user/repo.git
    const m = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);
    if (m) return `${m[1]}/${m[2]}`;
    return null;
}

function getCommits(range, includeMerges) {
    const rangeArg = range ? `${range}` : "";
    const mergesFlag = includeMerges ? "" : "--no-merges";
    const out = run(
        `git log ${mergesFlag} --pretty=format:%H%x09%s ${rangeArg}`,
    );
    if (!out) return [];
    return out
        .split("\n")
        .filter(Boolean)
        .map((line) => {
            const [hash, ...rest] = line.split("\t");
            const subject = rest.join("\t");
            return { hash, subject };
        });
}

function groupCommits(commits) {
    const groups = {
        feat: [],
        fix: [],
        perf: [],
        refactor: [],
        docs: [],
        style: [],
        test: [],
        build: [],
        ci: [],
        chore: [],
        revert: [],
        styles: [],
        other: [],
    };
    const ccRe =
        /^(?<type>feat|fix|perf|refactor|docs|style|styles|test|build|ci|chore|revert)(!?)(\((?<scope>[^)]+)\))?:\s*(?<desc>.+)$/i;
    for (const c of commits) {
        const m = ccRe.exec(c.subject);
        if (m?.groups) {
            const type = m.groups.type.toLowerCase();
            const scope = m.groups.scope ? `(${m.groups.scope})` : "";
            const desc = m.groups.desc;
            groups[type]?.push({ ...c, desc: `${scope} ${desc}`.trim() });
        } else {
            groups.other.push({ ...c, desc: c.subject });
        }
    }
    return groups;
}

function mdEscape(text) {
    return text.replace(/[<>]/g, (s) => ({ "<": "&lt;", ">": "&gt;" })[s]);
}

function renderMarkdown(version, date, groups, repo) {
    const lines = [];
    lines.push(`## ${version} (${date})`);
    const order = [
        ["feat", "Features"],
        ["fix", "Fixes"],
        ["perf", "Performance"],
        ["refactor", "Refactors"],
        ["docs", "Docs"],
        ["style", "Style"],
        ["test", "Tests"],
        ["build", "Build"],
        ["ci", "CI"],
        ["chore", "Chores"],
        ["revert", "Reverts"],
        ["other", "Other"],
        ["styles", "Styles"],
    ];
    let hasAny = false;
    for (const [key, title] of order) {
        const list = groups[key];
        if (list?.length) {
            hasAny = true;
            lines.push("", `### ${title}`);
            for (const item of list) {
                const short = item.hash.substring(0, 7);
                const link = repo
                    ? ` ([${short}](https://github.com/${repo}/commit/${item.hash}))`
                    : ` (${short})`;
                lines.push(`- ${mdEscape(item.desc)}${link}`);
            }
        }
    }
    if (!hasAny) {
        lines.push("", "_No changes_");
    }
    lines.push("", "");
    return lines.join("\n");
}

async function prependChangelog(section) {
    let existing = "";
    try {
        existing = await fs.readFile(CHANGELOG_PATH, "utf8");
    } catch { }
    if (!existing.trim()) {
        const header = "# Changelog\n\n";
        await fs.writeFile(CHANGELOG_PATH, header + section, "utf8");
        return;
    }
    const lines = existing.split("\n");
    if (lines[0].startsWith("# ")) {
        const header = lines[0] + "\n\n";
        const rest = lines.slice(2).join("\n");
        await fs.writeFile(CHANGELOG_PATH, header + section + rest, "utf8");
    } else {
        await fs.writeFile(CHANGELOG_PATH, section + existing, "utf8");
    }
}

async function main() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const version = getPkgVersion();
    const lastTag = getLastTag();
    const repo = getOriginRepo();

    // --since <ref> [--until <ref>] [--include-merges]
    const args = process.argv.slice(2);
    const sinceIdx = args.indexOf("--since");
    const untilIdx = args.indexOf("--until");
    const includeMerges = args.includes("--include-merges");
    const sinceRef =
        sinceIdx !== -1 && args[sinceIdx + 1] ? args[sinceIdx + 1] : null;
    const untilRef =
        untilIdx !== -1 && args[untilIdx + 1] ? args[untilIdx + 1] : "HEAD";

    let range = "";
    if (sinceRef) {
        range = `${sinceRef}..${untilRef}`;
    } else {
        let base = lastTag;
        const tags = getTagsSorted();
        if (tags.length) {
            const idx = tags.findIndex(
                (t) => t === version || t === `v${version}`,
            );
            if (idx !== -1 && idx + 1 < tags.length) {
                base = tags[idx + 1];
            }
        }
        if (base) range = `${base}..HEAD`;
    }

    const commits = getCommits(range, includeMerges);
    if (!commits.length) {
        console.log("no commits found for changelog");
        return;
    }

    const groups = groupCommits(commits);
    const md = renderMarkdown(version, dateStr, groups, repo);

    await prependChangelog(md);
    console.log(`${CHANGELOG_PATH}`);
}

main().catch((err) => {
    console.error("changelog script failed:", err);
    process.exit(1);
});
