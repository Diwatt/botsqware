import type { MastraDBMessage } from '@mastra/core/memory';
import type { ProcessOutputResultArgs, Processor } from '@mastra/core/processors';

export class ThinkTagStripper implements Processor {
    private static readonly CLOSE_TAG = '</think>';
    private static readonly OPEN_TAG = '<think>';

    public id = 'think-tag-stripper';

    public async processOutputResult({ messages }: ProcessOutputResultArgs): Promise<MastraDBMessage[]> {
        return messages.map((message: MastraDBMessage): MastraDBMessage => {
            if (message.role !== 'assistant') {
                return message;
            }

            const content = message.content;

            // If content uses parts (structured), remove reasoning parts and strip <think> tags from text parts
            if ('parts' in content && Array.isArray(content.parts)) {
                const filtered = content.parts
                    .filter((part) => part.type !== 'reasoning')
                    .map((part) => {
                        if (part.type === 'text' && typeof part.text === 'string') {
                            return { ...part, text: ThinkTagStripper.removeThinkContent(part.text) };
                        }
                        return part;
                    });

                return {
                    ...message,
                    content: {
                        ...content,
                        parts: filtered,
                    },
                };
            }

            // If content is a plain string, strip <think> tags from it
            if ('content' in content && typeof content.content === 'string') {
                return {
                    ...message,
                    content: {
                        ...content,
                        content: ThinkTagStripper.removeThinkContent(content.content),
                    },
                };
            }

            return message;
        });
    }

    // Private helper: remove <think>...</think> (case-insensitive), native methods only, no RegExp.
    // If an open tag is not closed, strip from the open tag to the end of the string.
    private static removeThinkContent(text: string): string {
        const openTag = ThinkTagStripper.OPEN_TAG;
        const closeTag = ThinkTagStripper.CLOSE_TAG;
        const openTagLen = openTag.length;
        const closeTagLen = closeTag.length;

        let result = '';
        let searchFrom = 0;
        const lowerText = text.toLowerCase();

        while (true) {
            const openPos = lowerText.indexOf(openTag, searchFrom);

            // No more open tags: append the remainder and finish
            if (openPos === -1) {
                result += text.substring(searchFrom);
                break;
            }

            // Append text before the open tag (preserve original casing)
            result += text.substring(searchFrom, openPos);

            // Find matching close tag after the open tag
            const closePos = lowerText.indexOf(closeTag, openPos + openTagLen);

            // If close tag is not found, strip from open tag to end (i.e., stop here)
            if (closePos === -1) {
                break;
            }

            // Move search cursor to after the close tag and continue
            searchFrom = closePos + closeTagLen;
        }

        return result;
    }
}
