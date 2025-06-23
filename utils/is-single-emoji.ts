import emojiRegex from "emoji-regex";

export const isSingleEmoji = (str: string) => {
    const regex = emojiRegex()
    const match = str.match(regex);
    return match && match[0] === str;
}