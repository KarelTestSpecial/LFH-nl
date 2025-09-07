document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');

    // Initial call to fetch data and start the process
    async function initAccordion() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP-fout! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.length > 0) {
                // Build the accordion first
                buildAccordion(data, container);
                // Then attach the now-async event listeners
                attachEventListeners();

                // --- START VAN DE WIJZIGING ---
                // Open de eerste (hoofd)node door een klik te simuleren
                const firstButton = container.querySelector('.accordion-button');
                if (firstButton) {
                    firstButton.click();
                }
                // --- EINDE VAN DE WIJZIGING ---
            } else {
                container.innerHTML = '<p>Geen data gevonden.</p>';
            }
        } catch (error) {
            container.innerHTML = '<p>Er is een fout opgetreden bij het laden van de content.</p>';
            console.error('Fout bij het ophalen of parsen van data.json:', error);
        }
    }

    // This function builds the HTML structure, including the links
    function buildAccordion(items, parentElement, currentPath = []) {
        if (!items || items.length === 0) {
            return;
        }
        items.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            const button = document.createElement('button');
            button.className = 'accordion-button';

            const newPath = [...currentPath, item.title];
            const pathString = newPath.join(' > ');
            const urlEncodedPath = encodeURIComponent(pathString);

            const link = document.createElement('a');
            link.textContent = item.title;
            // The href now contains the raw path string for easy access
            link.href = `topic.html?path=${urlEncodedPath}`;
            link.dataset.path = pathString; // Store raw path for logic

            button.appendChild(link);
            const panel = document.createElement('div');
            panel.className = 'accordion-panel';
            accordionItem.appendChild(button);
            accordionItem.appendChild(panel);
            parentElement.appendChild(accordionItem);

            if (item.children && item.children.length > 0) {
                buildAccordion(item.children, panel, newPath);
            } else {
                button.classList.add('no-children');
            }
        });
    }

    // --- START VAN DE FINALE WIJZIGING ---

    // This function now contains the core routing logic
    function attachEventListeners() {
        // The manifest is fetched once and stored for performance
        let manifest = [];
        let manifestFetched = false;
        const fetchManifest = async () => {
            if (manifestFetched) return manifest;
            try {
                const response = await fetch('content-manifest.json');
                if (!response.ok) throw new Error('Manifest fetch failed');
                manifest = await response.json();
                manifestFetched = true;
                return manifest;
            } catch (e) {
                console.error(e);
                return []; // Return empty on error
            }
        };
        // Pre-fetch the manifest when the page loads
        fetchManifest();

        container.addEventListener('click', async function(event) {
            const link = event.target.closest('a');

            if (link) {
                // --- Link Click Logic ---
                event.preventDefault(); // Stop navigation immediately
                const path = link.dataset.path;
                const manifest = await fetchManifest();

                if (manifest.includes(path)) {
                    // Path is in manifest, navigate to topic page
                    window.location.href = link.href;
                } else {
                    // Path not in manifest, open search in new tab
                    // NEW: Use the full path for a more specific search query
                    const keywords = path.replace(/ > /g, ', ');
                    const searchQuery = encodeURIComponent(keywords);
                    const searchUrl = `https://duckduckgo.com/?q=${searchQuery}`;
                    window.open(searchUrl, '_blank');
                }
                return; // End of link logic
            }

            const button = event.target.closest('.accordion-button');
            if (button && !button.classList.contains('no-children')) {
                // --- Accordion Toggle Logic ---
                button.classList.toggle('active');
                const panel = button.nextElementSibling;
                panel.classList.toggle('is-open');
            }
        });
    }

    // --- EINDE VAN DE FINALE WIJZIGING ---

    const style = document.createElement('style');
    style.textContent = `
        .accordion-button a {
            text-decoration: none;
            color: inherit;
            display: block;
            flex-grow: 1;
        }
        .accordion-button.no-children::after {
            content: "";
        }
    `;
    document.head.appendChild(style);

    initAccordion();
});
