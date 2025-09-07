document.addEventListener('DOMContentLoaded', () => {
    // Get handles to the placeholder elements
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    const topicTitleElement = document.getElementById('topic-title');
    const topicContentElement = document.getElementById('topic-content');

    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
    const pathString = params.get('path');

    if (pathString) {
        // Decode the path string and extract the title
        const decodedPath = decodeURIComponent(pathString);
        const pathSegments = decodedPath.split(' > ');
        const topicTitle = pathSegments[pathSegments.length - 1];

        // Populate the page with the info from the URL
        document.title = topicTitle;
        topicTitleElement.textContent = topicTitle;
        breadcrumbContainer.textContent = `Pad: ${decodedPath}`;
        topicContentElement.innerHTML = `
            <p>De content voor dit specifieke onderwerp wordt binnenkort toegevoegd.</p>
            <p>In een toekomstige versie zal hier door AI-gegenereerde informatie verschijnen over <strong>${topicTitle}</strong>.</p>
        `;
    } else {
        // Handle cases where no path is provided
        document.title = 'Fout: Onderwerp niet gevonden';
        topicTitleElement.textContent = 'Onderwerp niet gevonden';
        topicContentElement.textContent = 'Er is geen onderwerp-pad meegestuurd in de URL.';
    }
});
