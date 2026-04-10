import pinoPretty from 'pino-pretty';

function messageFormat(log, messageKey, _levelLabel, { colors }) {
    const raw = log[messageKey];
    const text = raw == null ? '' : typeof raw === 'string' ? raw : String(raw);

    const { name, level, time, pid, hostname, msg, v, ...meta } = log;

    let prefix = '';
    let coloredText = text;

    if (name === 'llm') {
        prefix = `${colors.bgYellow(colors.black(colors.bold(' [🤖 LLM] ')))} `;
        coloredText = colors.yellow(text);
    } else if (name === 'mastra') {
        prefix = `${colors.bgMagenta(colors.white(colors.bold(' [🧠 MASTRA] ')))} `;
        coloredText = colors.magenta(text);
    } else if (name === 'sys') {
        prefix = `${colors.bgCyan(colors.black(colors.bold(' [⚙️ SYS] ')))} `;
        coloredText = colors.cyan(text);
    }

    let metaString = '';
    if (Object.keys(meta).length > 0) {
        let rawJson = JSON.stringify(meta, null, 2);
        rawJson = rawJson.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        metaString = `\n${colors.gray(rawJson)}`;
    }

    return `${prefix}${coloredText}${metaString}`;
}

// biome-ignore lint/style/noDefaultExport: export default must remain on single line for pino-pretty transport
export default function pinoPrettyAppTransport(opts) {
    return pinoPretty({ ...opts, messageFormat });
}
