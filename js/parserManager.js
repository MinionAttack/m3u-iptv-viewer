'use strict';

const M3U_SECTION = Object.freeze({
    TVG_ID: Symbol('tvg-id'),
    TVG_NAME: Symbol('tvg-name'),
    TVG_LOGO: Symbol('tvg-logo'),
    GROUP_TITLE: Symbol('group-title'),
});

const LINE_REGEX = /(tvg-name|tvg-logo|tvg-id|group-title)="([^"]*)"/g;

let pendingChannelData = null;

async function processChannelEntries(entries) {
    if (Array.isArray(entries) && entries.length > 0) {
        for (const entry of entries) {
            if (!entry.startsWith('#EXTM3U')) {
                if (entry.startsWith('#EXTINF')) {
                    pendingChannelData = parseChannelInfo(entry);
                } else {
                    const fullChannelData = {...pendingChannelData, url: entry};
                    await insertChannelData(fullChannelData);
                    pendingChannelData = null;
                }
            }
        }
    }
}

function parseChannelInfo(channelInfo) {
    const channelData = {
        tvgId: '',
        tvgName: '',
        tvgLogo: '',
        group: '',
        subgroup: '',
        url: '',
    };
    const matches = channelInfo.matchAll(LINE_REGEX);
    for (const match of matches) {
        const tagKey = match[1];
        const tagValue = match[2];
        switch (tagKey) {
            case M3U_SECTION.TVG_ID.description:
                channelData.tvgId = tagValue;
                break;
            case M3U_SECTION.TVG_NAME.description:
                channelData.tvgName = tagValue;
                break;
            case M3U_SECTION.TVG_LOGO.description:
                channelData.tvgLogo = tagValue;
                break;
            case M3U_SECTION.GROUP_TITLE.description: {
                const {group, subgroup} = parseGroupTag(tagValue);
                channelData.group = group;
                channelData.subgroup = subgroup;
                break;
            }
            default:
                console.error(`Unsupported tag found while processing a channel line: ${tagKey}`);
        }
    }
    return channelData;
}

function parseGroupTag(groupTagValue) {
    if (groupTagValue.includes('/')) {
        return {
            group: groupTagValue,
            subgroup: '',
        }
    } else {
        const firstSpace = groupTagValue.indexOf(' ');
        if (firstSpace === -1) {
            return {
                group: groupTagValue,
                subgroup: '',
            }
        } else {
            return {
                group: groupTagValue.substring(0, firstSpace),
                subgroup: groupTagValue.substring(firstSpace + 1),
            }
        }
    }
}
