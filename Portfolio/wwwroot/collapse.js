function toggleCollapsable(collapseElementId, arrowElementId) {
    // Only trigger the collapse if we're not already collapsing
    if (document.getElementById(collapseElementId).classList.contains("collapsing"))
        return

    new bootstrap.Collapse('#' + collapseElementId).toggle()
    document.getElementById(arrowElementId).toggleAttribute("collapsed")
}