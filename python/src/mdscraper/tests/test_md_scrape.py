from ..md_scrape import cmp_hierarchy, Scope
from iok.meta import KnowledgeGraph


def test_cmp_hierarchy() -> None:
    s1, s2 = r"^[A-Za-z]", r"^###"
    ret = cmp_hierarchy(s1, s2)
    assert ret < 0

    s1, s2 = r"^###", r"^###"
    ret = cmp_hierarchy(s1, s2)
    assert ret == 0

    s1, s2 = r"^badcmp", r"^###"
    try:
        cmp_hierarchy(s1, s2)
    except AssertionError:
        pass


def test_scope() -> None:
    kg = KnowledgeGraph()
    scope = Scope(r"^###", "### Bitcoin", kg)
    assert scope._get_name() == "Bitcoin"

    test_text = "Script - Bitcoin Wiki"
    test_link = "https://en.bitcoin.it/wiki/Script"
    scope = Scope(r"^[*-]", f"* [{test_text}]({test_link})", kg)
    data = scope._get_data()
    assert data["text"] == test_text
    assert data["link"] == test_link
