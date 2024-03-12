const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}
const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {day: '2-digit',year: 'numeric', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp * 1000)
}

module.exports = { truncateStr, formatDate }
