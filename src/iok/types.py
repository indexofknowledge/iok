from enum import IntEnum


class NodeType(IntEnum):
    TOPIC = 1
    RESOURCE = 2


class ResourceType(IntEnum):
    DESCRIPTION = 1
    ARTICLE = 2
    VIDEO = 3
    PAPER = 4


LINK_TYPES = [ResourceType.ARTICLE, ResourceType.VIDEO, ResourceType.PAPER]

RESOURCE_HEADINGS = {
    ResourceType.DESCRIPTION: "Description",
    ResourceType.ARTICLE: "Articles",
    ResourceType.VIDEO: "Videos",
    ResourceType.PAPER: "Papers",
}
