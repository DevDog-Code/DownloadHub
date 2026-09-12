        const backBtn = document.getElementById('back-btn');
        const forwardBtn = document.getElementById('forward-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const homeBtn = document.getElementById('home-btn');
        const addressBar = document.getElementById('address-bar');
        const loadButton = document.getElementById('load-button');
        const browserFrame = document.getElementById('browser-frame');
        const currentUrlSpan = document.getElementById('current-url');
        const loadStatus = document.getElementById('load-status');

        const osDesktop = document.getElementById('desktop');
        const appWindow = document.getElementById('app-window');
        const closeAppBtn = document.getElementById('close-app');
        const browserIcon = document.getElementById('browser-icon');
        const editorIcon = document.getElementById('editor-icon');
        const searchIcon = document.getElementById('search-icon');
        const startButton = document.getElementById('start-button');
        const startMenu = document.getElementById('start-menu');
        const closeStartMenuBtn = document.getElementById('close-start-menu');
        const shutdownButton = document.getElementById('shutdown-button');
        const restartButton = document.getElementById('restart-button');
        const osClock = document.getElementById('os-clock');

        let history = [];
        let currentIndex = -1;
        const homeUrl = ''; // DogiOS home page fallback
        // Files in the workspace to search. Update this list if you add/remove files.
        const workspaceFiles = [
            'math-generator.css',
            'math-generator.html',
            'Search Test 1.0.html',
            'search-test.html',
            'browser.html',
            'dogi-editor.html'
        ];
        const editorFile = 'dogi-editor.html';

        // A standard helper function to calculate word similarity
function getEditDistance(a, b) {
    if (a.length === 0) return b.length; 
    if (b.length === 0) return a.length;
    let matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1, // substitution
                    matrix[i][j-1] + 1,   // insertion
                    matrix[i-1][j] + 1    // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// How you would use it when a search fails
function findClosestResult(userInput, database) {
    let closestMatch = null;
    let lowestDistance = Infinity;
    
    database.forEach(item => {
        let distance = getEditDistance(userInput.toLowerCase(), item.name.toLowerCase());
        
        // We want the lowest distance, but set a limit (like 4) so it doesn't suggest 
        // something completely unrelated if they type gibberish.
        if (distance < lowestDistance && distance < 4) {
            lowestDistance = distance;
            closestMatch = item;
        }
    });
    
    return closestMatch; // Returns the closest database item object, or null
}

        // Local dog-breed search database (from search-test.html)
        const searchDatabase = {
            'amazon.com': [
                { text: 'Amazon.com, Inc. is an American multinational technology company based in Seattle, Washington, that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence. It is one of the Big Five companies in the U.S. information technology industry, along with Google, Apple, Microsoft, and Meta.',
                  url: 'www.amazon.com',
                  label: 'Amazon.com'
                },
                'Founded by Jeff Bezos on July 5, 1994, Amazon started as an online marketplace for books but later diversified to sell electronics, software, video games, apparel, furniture, food, toys, and jewelry. It also offers cloud computing services through its Amazon Web Services (AWS) division.',
                'Visit amazon.com for shopping, media streaming, and cloud services.'
            ],
            'labrador retriever': [
                'The Labrador Retriever is a friendly and outgoing breed that is one of the most popular dog breeds in the United States. They are known for their intelligence, trainability, and gentle temperament.',
                'Labradors are medium to large-sized dogs with a short, dense coat that can be black, yellow, or chocolate. They have a strong build and are often used as service dogs, therapy dogs, and search-and-rescue dogs.',
                'Labrador Retrievers require regular exercise and mental stimulation to stay happy and healthy. They are great family pets and get along well with children and other animals.'
            ],
            'golden retriever': [
                'The Golden Retriever is a friendly, intelligent, and devoted breed that is one of the most popular dog breeds in the United States. They are known for their beautiful golden coats and gentle temperament.',
                'Golden Retrievers are medium to large-sized dogs with a dense, water-repellent coat that can range from light to dark golden. They are often used as service dogs, therapy dogs, and search-and-rescue dogs.',
                'Golden Retrievers require regular exercise and mental stimulation to stay happy and healthy. They are great family pets and get along well with children and other animals.'
            ],
            'german shorthaired pointer': [
                'The German Shorthaired Pointer is an energetic and versatile breed that excels in hunting and various dog sports. They are known for their intelligence, agility, and friendly nature.',
                'German Shorthaired Pointers have a short, dense coat that can be liver, liver and white, or liver roan. They are medium to large-sized dogs with a strong, athletic build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great companions for active families and individuals.'
            ],
            'coker spaniel': [
                'The Cocker Spaniel is a cheerful and affectionate breed that is known for its beautiful, silky coat and expressive eyes. They are one of the most popular dog breeds in the United States.',
                'Cocker Spaniels come in two varieties: the American Cocker Spaniel and the English Cocker Spaniel. Both have a medium-length coat that can come in a variety of colors, including black, liver, red, and golden.',
                'Cocker Spaniels require regular grooming to maintain their coat and prevent matting. They are great family pets and get along well with children and other animals.'
            ],
            'english springer spaniel': [
                'The English Springer Spaniel is a friendly, intelligent, and versatile breed that is known for its beautiful coat and energetic personality. They are one of the most popular dog breeds in the United States.',
                'English Springer Spaniels have a medium-length coat that can be black and white, liver and white, or golden and white. They are medium-sized dogs with a well-proportioned build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great family pets and get along well with children and other animals.'
            ],
            'brittany spaniel': [
                'The Brittany Spaniel, also known simply as the Brittany, is an energetic and versatile breed that excels in hunting and various dog sports. They are known for their friendly nature and distinctive coat pattern.',
                'Brittany Spaniels have a medium-length coat that can be orange and white, liver and white, or solid liver. They are medium-sized dogs with a strong, athletic build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great companions for active families and individuals.'
            ],
            'irish setter': [
                'The Irish Setter is a graceful and intelligent breed that is known for its distinctive red coat and elegant appearance. They are excellent companions for active families and individuals.',
                'Irish Setters have a medium-length, silky coat that can be red, white, or a combination of both. They are medium to large-sized dogs with a well-proportioned build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great companions for active families and individuals.'
            ],
            'vizsla': [
                'The Vizsla is a friendly, intelligent, and versatile breed that is known for its short, dense coat and affectionate nature. They are excellent companions for active families and individuals.',
                'Vizslas have a short, fine coat that can be golden, rust, or a combination of both. They are medium-sized dogs with a well-proportioned build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great companions for active families and individuals.'
            ],
            'gordon setter': [
                'The Gordon Setter is a large, powerful breed known for its striking black and tan coat and loyal nature. They are excellent companions for active families and individuals.',
                'Gordon Setters have a long, silky coat that requires regular grooming. They are strong, athletic dogs with a well-proportioned build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great companions for active families and individuals.'
            ],
            'bloodhound': [
                'The Bloodhound is a gentle, intelligent breed known for its exceptional sense of smell and tracking abilities. They are excellent companions for active families and individuals.',
                'Bloodhounds have a long, droopy coat that requires regular grooming. They are large, powerful dogs with a well-proportioned build.',
                'These dogs require regular exercise and mental stimulation to stay happy and healthy. They are great companions for active families and individuals.'
            ],
            'basset hound': [
                'The Basset Hound is a friendly, laid-back breed known for its long ears and droopy expression. They are excellent companions for families and individuals who enjoy a more relaxed lifestyle.',
                'Basset Hounds have a short, dense coat that can be tri-color, bi-color, or solid. They are medium-sized dogs with a long body and short legs.',
                'These dogs require regular exercise to stay healthy but are generally less active than other breeds. They are great companions for families and individuals who enjoy a more relaxed lifestyle.'
            ],
            'code editor': [
                { text: 'Top result is the Dogi Editor',
                  url: 'dogi-editor.html',
                  label: 'Dogi Editor'
                }
            ],
            'Dogs': [
                'There are over 340 million dogs in the world.',
                'Dogs are known for their loyalty and companionship.',
                'They come in a wide range of breeds, sizes, and temperaments.'
            ],
            'Cats': [
                'Cats are one of the most popular pets in the world.',
                'They are admired for their independence and agility.',
                'Many cats enjoy playing with toys and relaxing in sunny spots.'
            ],
            'Space': [
                'Space is the final frontier for human exploration.',
                'There are billions of stars in our galaxy.',
                'Astronomers use telescopes to study distant planets and galaxies.'
            ],
            'Toys': [
                'Toys are objects for children to play with.',
                'They can be made of various materials like plastic, wood, or fabric.',
                'Toys help in the development of motor skills and creativity.'
            ],
            'Carpentry': [
                'Carpentry is the skilled trade of cutting, shaping, and installing building materials.',
                'Carpenters work with wood, but may also work with other materials.',
                'They construct, install, and repair structures and fixtures.'
            ],
            'Coding': [
                'Coding is the process of writing instructions for computers to perform specific tasks.',
                'It involves using programming languages like Python, JavaScript, and C++.',
                'Coding is essential for developing software, websites, and applications.'
            ],
            'Gardening': [
                'Gardening is the practice of growing and cultivating plants.',
                'It can be done for aesthetic, recreational, or food production purposes.',
                'Gardeners often grow flowers, vegetables, herbs, and trees.'
            ],
            'Cooking': [
                'Cooking is the art and science of preparing food for consumption.',
                'It involves techniques like boiling, frying, baking, and grilling.',
                'Cooking can be a creative and enjoyable activity for many people.'
            ],
            'Music': [
                'Music is an art form that uses sound and rhythm to express emotions and ideas.',
                'It can be created using instruments, vocals, or digital tools.',
                'Music plays a significant role in culture and entertainment worldwide.'
            ],
            'Travel': [
                'Travel is the movement of people between distant geographical locations.',
                'It can be done for leisure, business, or other purposes.',
                'Travel allows people to experience new cultures, cuisines, and landscapes.'
            ],
            'Sports': [
                'Sports are competitive physical activities that often involve skill and strategy.',
                'They can be played individually or in teams, and include games like soccer, basketball, and tennis.',
                'Sports promote physical fitness, teamwork, and entertainment.'
            ],
            'Art': [
                'Art is a diverse range of human activities that involve creative expression.',
                'It includes visual arts like painting and sculpture, as well as performing arts like music and dance.',
                'Art can evoke emotions, provoke thought, and reflect cultural values.'
            ],
            'Technology': [
                'Technology refers to the application of scientific knowledge for practical purposes.',
                'It includes tools, machines, and systems that help solve problems and improve lives.',
                'Technology has transformed communication, transportation, healthcare, and many other fields.'
            ],
            'History': [
                'History is the study of past events, particularly in human affairs.',
                'It helps us understand how societies have evolved over time.',
                'Historians use various sources like documents, artifacts, and oral histories to reconstruct the past.'
            ],
            'Literature': [
                'Literature is written works, especially those considered to have artistic or intellectual value.',
                'It includes genres like fiction, poetry, drama, and non-fiction.',
                'Literature can explore themes of human experience, culture, and society.'
            ],
            'Science': [
                'Science is the systematic study of the natural world through observation and experimentation.',
                'It encompasses various disciplines like physics, chemistry, biology, and astronomy.',
                'Scientific discoveries have led to advancements in medicine, technology, and our understanding of the universe.'
            ],
            'Mathematics': [
                'Mathematics is the abstract science of numbers, quantity, and space.',
                'It includes topics like algebra, geometry, calculus, and statistics.',
                'Mathematics is essential for fields like engineering, physics, economics, and computer science.'
            ],
            'Philosophy': [
                'Philosophy is the study of fundamental questions about existence, knowledge, values, reason, and language.',
                'It has various branches like metaphysics, epistemology, ethics, and logic.',
                'Philosophers seek to understand the nature of reality and human experience through critical thinking and argumentation.'
            ],
            'Psychology': [
                'Psychology is the scientific study of the mind and behavior.',
                'It explores topics like cognition, emotion, personality, and social interactions.',
                'Psychologists use research methods to understand how people think, feel, and behave.'
            ],
            'Economics': [
                'Economics is the social science that studies the production, distribution, and consumption of goods and services.',
                'It analyzes how individuals, businesses, and governments make choices about resource allocation.',
                'Economics includes topics like supply and demand, market structures, and economic policy.'
            ],
            'Symbols': [
                'Symbols are visual representations that convey meaning or represent ideas.',
                'They can be found in language, art, religion, and culture.',
                'Symbols often carry deep significance and can evoke strong emotions or associations.'
            ],
            'Vehicles': [
                'Vehicles are machines used for transporting people or goods.',
                'They include cars, trucks, bicycles, airplanes, and boats.',
                'Vehicles have revolutionized transportation and enabled global connectivity.'
            ],
            'Food': [
                'Food is any substance consumed to provide nutritional support for the body.',
                'It can be of plant or animal origin and contains essential nutrients like carbohydrates, proteins, fats, vitamins, and minerals.',
                'Food is a fundamental part of culture and social interaction around the world.'
            ],
            'Fundamental': [
                'Fundamental refers to something that is basic, essential, or foundational.',
                'It can apply to concepts, principles, or elements that are necessary for understanding or functioning.',
                'In various fields, fundamental knowledge is crucial for building more complex ideas and systems.'
            ],
            'Testing': [
                'Testing is the process of evaluating a system or component to determine if it meets specified requirements.',
                'It can involve various methods like unit testing, integration testing, and user acceptance testing.',
                'Testing helps identify defects, ensure quality, and validate that a product works as intended.'
            ],
            'Gaming': [
                'Gaming refers to playing electronic games, whether through consoles, computers, or mobile devices.',
                'It has become a major form of entertainment and social interaction worldwide.',
                'Gaming can range from casual mobile games to competitive esports tournaments.'
            ],
            'MassMedia': [
                'Mass media refers to the various means of communication that reach large audiences.',
                'It includes television, radio, newspapers, magazines, and digital platforms.',
                'Mass media plays a significant role in shaping public opinion and disseminating information.'
            ],
            'Fashion': [
                'Fashion is a popular style or practice, especially in clothing, footwear, accessories, and makeup.',
                'It is influenced by cultural, social, and economic factors and can change rapidly over time.',
                'Fashion allows individuals to express their identity and creativity through their appearance.'
            ],
            'Health': [
                'Health is a state of complete physical, mental, and social well-being.',
                'It is not merely the absence of disease or infirmity.',
                'Maintaining good health involves a balanced diet, regular exercise, and adequate rest.'
            ],
            'Education': [
                'Education is the process of facilitating learning, or the acquisition of knowledge, skills, values, and habits.',
                'It can take place in formal settings like schools and universities, as well as through informal means like self-study and life experiences.',
                'Education is essential for personal development and societal progress.'
            ],
            'DogiOS': [
                'DogiOS is a sleek, modern day OS application, that will not be a real bootable OS until 2027-2028.',
                'Apps: Files, Terminal, Settings, Notes, Browser, and an itegrated start screen.'
                'Early access will start at the alpha state.'
            ]
        };

        // Initialize with home page — behavior depends on settings.homeBehavior
        function loadHomePage() {
            if (settings.browserShutdown) {
                browserFrame.src = 'about:blank';
                currentUrlSpan.textContent = 'Browser shut down';
                loadStatus.textContent = 'Restart via Operator Settings';
                updateBrowserControlsState();
                return;
            }
            const last = localStorage.getItem('lastSearchHtml');
            const meta = localStorage.getItem('lastSearchMeta');

            if (settings.homeBehavior === 'blank') {
                browserFrame.src = 'about:blank';
                currentUrlSpan.textContent = 'Home';
                loadStatus.textContent = '';
                return;
            }

            const shouldShowShortcutHome = true;

            if (shouldShowShortcutHome) {
                const welcome = `<!doctype html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width,initial-scale=1">
                  <title>Shortcut Home</title>
                  <style>
                    :root { color-scheme: light; }
                    * { box-sizing: border-box; }
                    body {
                      margin: 0;
                      min-height: 100vh;
                      font-family: Arial, Helvetica, sans-serif;
                      background: transparent;
                      color: #0f172a;
                    }
                    .shortcut-shell {
                      max-width: 1100px;
                      margin: 0 auto;
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      padding: 24px;
                    }
                    .shortcut-copy {
                      width: 100%;
                    }
                    .eyebrow { text-transform: uppercase; letter-spacing: .18em; font-size: .72rem; color: #2563eb; font-weight: 700; }
                    h1 { margin: 8px 0 8px; font-size: 2rem; line-height: 1.1; }
                    p { color: #334155; line-height: 1.45; }
                    .shortcut-grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                      gap: 14px;
                      margin-top: 18px;
                    }
                    .shortcut-card {
                      border: 1px solid rgba(148,163,184,0.28);
                      border-radius: 18px;
                      padding: 14px;
                      cursor: pointer;
                      background: linear-gradient(145deg, #ffffff, #f1f5f9);
                      box-shadow: 0 12px 24px rgba(15,23,42,0.08);
                      transition: transform .12s ease, box-shadow .12s ease;
                      text-align: left;
                    }
                    .shortcut-card:hover { transform: translateY(-2px); box-shadow: 0 18px 28px rgba(37,99,235,0.14); }
                    .shortcut-icon { font-size: 1.8rem; margin-bottom: 6px; }
                    .shortcut-card h2 { margin: 0 0 4px; font-size: 1rem; color: #0f172a; }
                    .shortcut-card p { margin: 0; font-size: .92rem; color: #475569; }
                    .chip-row { display:flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
                    .chip { display:inline-flex; align-items:center; gap:6px; padding: 8px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: .85rem; border: 1px solid #bfdbfe; }
                  </style>
                </head>
                <body>
                  <div class="shortcut-shell">
                    <section class="shortcut-copy">
                      <div class="eyebrow">Shortcut Home</div>
                      <h1>Start from a browser shortcut.</h1>
                      <p>These app tiles behave like Chrome shortcuts: fast, visual, and ready to open your common tools in the main browser view.</p>
                      <div class="shortcut-grid">
                        <button class="shortcut-card" onclick="window.parent.openShortcut('search-test.html')">
                          <div class="shortcut-icon">🔎</div>
                          <h2>Search</h2>
                          <p>Open the built-in search experience.</p>
                        </button>
                        <button class="shortcut-card" onclick="window.parent.openShortcut('dogi-editor.html')">
                          <div class="shortcut-icon">📝</div>
                          <h2>Editor</h2>
                          <p>Launch the Dogi Editor in the main frame.</p>
                        </button>
                        <button class="shortcut-card" onclick="window.parent.openShortcut('math-generator.html')">
                          <div class="shortcut-icon">📐</div>
                          <h2>Math Generator</h2>
                          <p>Open the math generator page.</p>
                        </button>
                        <button class="shortcut-card" onclick="window.parent.openShortcut('Search Test 1.0.html')">
                          <div class="shortcut-icon">🧭</div>
                          <h2>Search Test</h2>
                          <p>Open the original search test page.</p>
                        </button>
                      </div>
                      <div class="chip-row">
                        <span class="chip">Tip: press Ctrl/Cmd+L to focus the search box</span>
                        <span class="chip">Tip: press Ctrl/Cmd+R to refresh</span>
                      </div>
                    </section>
                  </div>
                </body>
                </html>`;
                browserFrame.srcdoc = welcome;
                currentUrlSpan.textContent = 'Home';
                loadStatus.textContent = 'Shortcut home';
                return;
            }

            // blank behavior
            browserFrame.src = 'about:blank';
            currentUrlSpan.textContent = 'Home';
            loadStatus.textContent = '';
        }

        function openShortcut(file) {
            if (!file) return;
            loadUrl(file);
        }

        function loadUrl(url) {
            if (settings.browserShutdown) {
                showError('Cannot load URL while browser is shut down. Restart browser in Operator Settings.');
                return;
            }
            // Validate and format URL
            if (!url) return;

            // Keep relative local files as-is; add protocol only for remote URLs.
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                const localFileExtensions = ['.html', '.htm', '.css', '.js', '.md', '.txt'];
                const isRelativePath = url.startsWith('./') || url.startsWith('../') || url.startsWith('/') || localFileExtensions.some(ext => url.endsWith(ext));
                if (!isRelativePath) {
                    url = 'https://' + url;
                }
            }

            // Add to history
            if (currentIndex < history.length - 1) {
                history = history.slice(0, currentIndex + 1);
            }
            history.push(url);
            currentIndex = history.length - 1;

            // Update address bar
            addressBar.value = url;
            currentUrlSpan.textContent = url;

            // Load in iframe
            loadStatus.textContent = 'Loading...';
            browserFrame.onload = () => {
                loadStatus.textContent = 'Ready';
            };
            browserFrame.onerror = () => {
                loadStatus.textContent = 'Failed to load';
            };

            try {
                browserFrame.src = url;
            } catch (error) {
                showError('Failed to load: ' + error.message);
            }

            updateNavButtons();
        }

        // Search workspace files for the given term and display results inside the iframe.
        async function runWorkspaceSearch(term) {
            if (settings.browserShutdown) {
                showError('Cannot search while browser is shut down. Restart browser in Operator Settings.');
                return;
            }
            const q = (term || '').trim();
            if (!q) {
                showError('Please enter a search term.');
                return;
            }

            // First: check local breed database (search-test behavior)
            const normalized = q.toLowerCase();
            if (searchDatabase[normalized]) {
                const entries = searchDatabase[normalized];
                let html = `<!doctype html><html><head><meta charset="utf-8"><title>Results for ${escapeHtml(q)}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:1rem}li{margin-bottom:0.5rem}</style></head><body>`;
                html += `<h2>Results for "${escapeHtml(q)}"</h2><div class="result-box"><p class="result-message">${escapeHtml('Found ' + entries.length + ' item(s)')}</p><ul>`;
                for (const line of entries) {
                    if (typeof line === 'object' && line !== null) {
                        const text = escapeHtml(line.text || '');
                        const link = line.url ? `<a href="${escapeHtml(line.url)}" target="_blank" rel="noreferrer">${escapeHtml(line.label || line.url)}</a>` : '';
                        html += `<li>${text}${link ? ' ' + link : ''}</li>`;
                    } else {
                        html += `<li>${escapeHtml(line)}</li>`;
                    }
                }
                html += `</ul></div></body></html>`;
                // persist last results (only if enabled)
                try { if (settings.persistLastResults) { localStorage.setItem('lastSearchHtml', html); localStorage.setItem('lastSearchMeta', `${entries.length} result(s)`); } } catch (e) {}
                browserFrame.srcdoc = html;
                currentUrlSpan.textContent = `Local: ${q}`;
                loadStatus.textContent = `${entries.length} result(s)`;
                return;
            }

            const submissions = getSubmissions();
            const submissionMatches = [];
            const lowerQuery = q.toLowerCase();
            for (const sub of submissions) {
                const text = `${sub.title} ${sub.description || ''} ${sub.code}`.toLowerCase();
                if (text.includes(lowerQuery)) {
                    const preview = sub.description ? sub.description : sub.code.substring(0, 180);
                    submissionMatches.push({ title: sub.title, submitter: sub.submitter, submittedAt: sub.submittedAt, preview, code: sub.code });
                }
            }

            if (submissionMatches.length > 0) {
                let html = `<!doctype html><html><head><meta charset="utf-8"><title>Submissions for ${escapeHtml(q)}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:1rem}pre{background:#f6f8fa;padding:0.75rem;border-radius:6px;white-space:pre-wrap;word-break:break-word;border:1px solid #dbeafe} .submission{margin-bottom:1rem;padding:0.85rem;border:1px solid #e2e8f0;border-radius:0.85rem;background:#f8fafc}</style></head><body>`;
                html += `<h2>Submission matches for "${escapeHtml(q)}"</h2>`;
                html += `<p>${escapeHtml('Found ' + submissionMatches.length + ' submission(s)')}</p>`;
                for (const match of submissionMatches) {
                    html += `<div class="submission"><h3>${escapeHtml(match.title)}</h3><p style="margin:0.25rem 0;color:#475569;">Submitted by ${escapeHtml(match.submitter)} on ${escapeHtml(match.submittedAt)}</p><p style="margin:0.75rem 0;color:#334155;">${escapeHtml(match.preview)}</p><pre>${escapeHtml(match.code)}</pre></div>`;
                }
                html += '</body></html>';
                try { if (settings.persistLastResults) { localStorage.setItem('lastSearchHtml', html); localStorage.setItem('lastSearchMeta', `${submissionMatches.length} submission(s)`); } } catch (e) {}
                browserFrame.srcdoc = html;
                currentUrlSpan.textContent = `Submissions: ${q}`;
                loadStatus.textContent = `${submissionMatches.length} submission(s)`;
                return;
            }

            // Fallback: search workspace files
            const results = [];

            for (const file of workspaceFiles) {
                try {
                    const res = await fetch(file);
                    if (!res.ok) continue;
                    const text = await res.text();
                    const lower = text.toLowerCase();
                    const idx = lower.indexOf(q.toLowerCase());
                    if (idx !== -1) {
                        const start = Math.max(0, idx - 60);
                        const end = Math.min(text.length, idx + q.length + 60);
                        const snippet = text.substring(start, end).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        results.push({ file, snippet });
                    }
                } catch (err) {
                    // fetch can fail when opened via file:// in some browsers; ignore and continue
                }
            }

            // Build HTML with results
            let html = `<!doctype html><html><head><meta charset="utf-8"><base href="${location.href}"><title>Search results for ${escapeHtml(q)}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:1rem}a{color:#0366d6;text-decoration:none}a:hover{text-decoration:underline}pre{background:#f6f8fa;padding:0.5rem;border-radius:6px;overflow:auto} .result-card{margin-bottom:1.5rem;border:1px solid #e2e8f0;border-radius:0.85rem;overflow:hidden;background:#f8fafc} .result-card-header{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;padding:0.8rem 1rem;background:#eef4ff} .result-card-body{padding:1rem} .mini-iframe{width:100%;height:220px;border:none;background:white;}</style></head><body>`;
            html += `<h2>Search results for "${escapeHtml(q)}"</h2>`;
            if (results.length === 0) {
                html += `<p>No matches found in workspace files. If you're opening this file via <code>file://</code>, some browsers block programmatic file loading — try running a local server (e.g., <code>python -m http.server</code>).</p>`;
            } else {
                html += '<ul style="list-style:none;padding:0;margin:0">';
                for (const r of results) {
                    html += `<li class="result-card"><div class="result-card-header"><div style="flex:1;min-width:220px;"><a href="${encodeURI(r.file)}">${escapeHtml(r.file)}</a></div><button onclick="window.parent.loadUrl('${escapeJs(r.file)}')" style="white-space:nowrap;">Open main</button></div><div class="result-card-body"><pre>${highlight(r.snippet, q)}</pre><div style="margin-top:0.75rem;border:1px solid #dbeafe;border-radius:0.75rem;overflow:hidden;"><div style="padding:0.6rem 0.85rem;background:#f1f5f9;color:#1e3a8a;font-size:0.95rem;display:flex;align-items:center;justify-content:space-between;">Mini browser preview<button onclick="window.parent.openMiniBrowser('${escapeJs(r.file)}')" style="white-space:nowrap;">Open mini browser</button></div><iframe class="mini-iframe" src="${encodeURI(r.file)}"></iframe></div></div></li>`;
                }
                html += '</ul>';
            }
            html += '</body></html>';

            // persist last results (only if enabled)
            try { if (settings.persistLastResults) { localStorage.setItem('lastSearchHtml', html); localStorage.setItem('lastSearchMeta', `${results.length} match(es)`); } } catch (e) {}
            browserFrame.srcdoc = html;
            currentUrlSpan.textContent = `Search: ${q}`;
            loadStatus.textContent = `${results.length} match(es)`;
        }

        function escapeHtml(s) {
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function escapeJs(s) {
            return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
        }

        function highlight(snippet, term) {
            if (!term) return snippet;
            const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
            return snippet.replace(re, match => `<mark>${match}</mark>`);
        }

        function updateNavButtons() {
            backBtn.disabled = currentIndex <= 0;
            forwardBtn.disabled = currentIndex >= history.length - 1;
        }

        function openApp(appName) {
            if (!appWindow || !osDesktop) return;
            if (appName === 'browser') {
                loadHomePage();
                currentUrlSpan.textContent = 'Dogi Search';
                loadStatus.textContent = 'Browser launched';
            } else if (appName === 'editor') {
                browserFrame.src = editorFile;
                currentUrlSpan.textContent = 'Dogi Editor';
                loadStatus.textContent = 'Editor launched';
            } else if (appName === 'search') {
                browserFrame.src = 'search-test.html';
                currentUrlSpan.textContent = 'Search App';
                loadStatus.textContent = 'Search launched';
            } else if (appName === 'settings') {
                browserFrame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><title>DogiOS Settings</title><style>body{font-family:Arial,Helvetica,sans-serif;background:#0f172a;color:#e2e8f0;padding:1.5rem}h1{margin-bottom:0.75rem;color:#f8fafc}button{padding:0.65rem 0.9rem;border-radius:0.65rem;border:1px solid #475569;background:#111827;color:#f8fafc;cursor:pointer}section{margin-top:1rem;padding:1rem;border-radius:0.85rem;background:#111827;border:1px solid #273449}</style></head><body><h1>DogiOS Settings</h1><section><h2>System</h2><p>Use the browser menu to manage operator settings, reporting, and power controls.</p></section><section><h2>Appearance</h2><p>More OS-style controls are coming soon.</p></section></body></html>`;
                currentUrlSpan.textContent = 'Settings';
                loadStatus.textContent = 'Settings opened';
            }

            appWindow.classList.remove('hidden');
            osDesktop.classList.add('blurred');
            closeStartMenu();
        }

        function toggleStartMenu() {
            const open = !startMenu.classList.contains('hidden');
            if (open) {
                startMenu.classList.add('hidden');
                if (appWindow.classList.contains('hidden')) {
                    osDesktop.classList.remove('blurred');
                }
            } else {
                startMenu.classList.remove('hidden');
                osDesktop.classList.add('blurred');
            }
        }

        function closeStartMenu() {
            startMenu.classList.add('hidden');
            if (appWindow.classList.contains('hidden')) {
                osDesktop.classList.remove('blurred');
            }
        }

        function shutdownOS() {
            closeAppWindow();
            closeStartMenu();
            const label = document.getElementById('taskbar-label');
            if (label) label.textContent = 'Shut down';
            alert('DogiOS is now shut down. Refresh the page to restart.');
        }

        function restartOS() {
            closeAppWindow();
            closeStartMenu();
            const label = document.getElementById('taskbar-label');
            if (label) label.textContent = 'Restarting...';
            setTimeout(() => {
                window.location.reload();
            }, 400);
        }

        function closeAppWindow() {
            appWindow.classList.add('hidden');
            if (startMenu.classList.contains('hidden')) {
                osDesktop.classList.remove('blurred');
            }
            browserFrame.src = 'about:blank';
            currentUrlSpan.textContent = 'DogiOS Home';
            loadStatus.textContent = 'App closed';
        }

        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            osClock.textContent = `${hours}:${minutes}`;
        }

        function initializeDogiOS() {
            if (!osDesktop || !appWindow || !closeAppBtn || !browserIcon || !editorIcon || !searchIcon || !startButton || !startMenu || !closeStartMenuBtn || !shutdownButton || !restartButton) {
                return;
            }
            updateClock();
            setInterval(updateClock, 1000 * 60);
            closeAppBtn.addEventListener('click', closeAppWindow);
            browserIcon.addEventListener('click', () => openApp('browser'));
            editorIcon.addEventListener('click', () => openApp('editor'));
            searchIcon.addEventListener('click', () => openApp('search'));
            startButton.addEventListener('click', toggleStartMenu);
            closeStartMenuBtn.addEventListener('click', closeStartMenu);
            shutdownButton.addEventListener('click', shutdownOS);
            restartButton.addEventListener('click', restartOS);

            document.querySelectorAll('.start-app-button').forEach(button => {
                button.addEventListener('click', () => {
                    openApp(button.dataset.app);
                });
            });

            document.addEventListener('click', (event) => {
                if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
                    closeStartMenu();
                }
            });
        }

        // Menu and mini-browser logic
        const menuBtn = document.getElementById('menu-btn');
        const menuDropdown = document.getElementById('menu-dropdown');

        function toggleMenu() {
            const open = menuDropdown.style.display === 'block';
            menuDropdown.style.display = open ? 'none' : 'block';
            menuDropdown.setAttribute('aria-hidden', open ? 'true' : 'false');
            if (!open) renderMenuItems();
        }

        menuBtn.addEventListener('click', toggleMenu);

        function renderEditorDownloadItem(root) {
            const item = document.createElement('div');
            item.className = 'menu-item';
            const left = document.createElement('div');
            left.innerHTML = '<strong>Dogi Editor</strong><div style="font-size:0.9rem;color:#555;">Open the editor or download it for offline use.</div>';
            const right = document.createElement('div');
            right.style.display = 'flex';
            right.style.gap = '0.4rem';

            const openBtn = document.createElement('button');
            openBtn.textContent = 'Open';
            openBtn.addEventListener('click', () => { toggleMenu(); loadUrl(editorFile); });

            const downloadBtn = document.createElement('a');
            downloadBtn.textContent = 'Download';
            downloadBtn.href = editorFile;
            downloadBtn.download = 'Dogi-Editor.html';
            downloadBtn.style.display = 'inline-flex';
            downloadBtn.style.alignItems = 'center';
            downloadBtn.style.justifyContent = 'center';
            downloadBtn.style.padding = '0.5rem 1rem';
            downloadBtn.style.border = '1px solid #d0d0d0';
            downloadBtn.style.borderRadius = '0.5rem';
            downloadBtn.style.background = '#f5f5f5';
            downloadBtn.style.color = 'inherit';
            downloadBtn.style.textDecoration = 'none';
            downloadBtn.addEventListener('mouseover', () => { downloadBtn.style.background = '#e8e8e8'; });
            downloadBtn.addEventListener('mouseout', () => { downloadBtn.style.background = '#f5f5f5'; });

            right.appendChild(openBtn);
            right.appendChild(downloadBtn);
            item.appendChild(left);
            item.appendChild(right);
            root.appendChild(item);
        }

        function renderMenuItems() {
            menuDropdown.innerHTML = '';

            // Account section
            renderAccountSection(menuDropdown);
            renderEditorDownloadItem(menuDropdown);
            renderSubmissionSection(menuDropdown);

            // Separator
            let sep = document.createElement('hr');
            sep.style.border = 'none';
            sep.style.borderTop = '1px solid #eef6ff';
            menuDropdown.appendChild(sep);

            // Settings header
            const settingsHeader = document.createElement('div');
            settingsHeader.style.padding = '0.5rem';
            settingsHeader.innerHTML = '<strong>Operator Settings</strong>';
            menuDropdown.appendChild(settingsHeader);

            // Authentication: settings are protected
            const passHash = getStoredPasswordHash();
            if (!isSettingsUnlocked()) {
                const authBox = document.createElement('div');
                authBox.style.padding = '0.5rem';

                if (!passHash) {
                    // No password set -> allow operator to set one
                    const note = document.createElement('div');
                    note.textContent = 'No operator password set. Create one to protect settings.';
                    note.style.marginBottom = '0.4rem';
                    authBox.appendChild(note);

                    const pw1 = document.createElement('input'); pw1.type = 'password'; pw1.placeholder = 'Enter new password'; pw1.className = 'settings-input'; pw1.style.marginRight = '0.4rem';
                    const pw2 = document.createElement('input'); pw2.type = 'password'; pw2.placeholder = 'Confirm password'; pw2.className = 'settings-input'; pw2.style.marginLeft = '0.4rem';
                    const setBtn = document.createElement('button'); setBtn.textContent = 'Set password'; setBtn.style.display = 'block'; setBtn.style.marginTop = '0.5rem';
                    setBtn.addEventListener('click', async () => {
                        if (!pw1.value) { alert('Password cannot be empty'); return; }
                        if (pw1.value !== pw2.value) { alert('Passwords do not match'); return; }
                        await setPassword(pw1.value);
                        renderMenuItems();
                    });
                    authBox.appendChild(pw1); authBox.appendChild(pw2); authBox.appendChild(setBtn);
                } else {
                    // Password exists -> unlock form
                    const note = document.createElement('div');
                    note.textContent = 'Settings are locked. Enter operator password to unlock.';
                    note.style.marginBottom = '0.4rem';
                    authBox.appendChild(note);

                    const pw = document.createElement('input'); pw.type = 'password'; pw.placeholder = 'Operator password'; pw.className = 'settings-input';
                    const unlockBtn = document.createElement('button'); unlockBtn.textContent = 'Unlock'; unlockBtn.style.marginLeft = '0.4rem';
                    unlockBtn.addEventListener('click', async () => {
                        const ok = await verifyAndUnlock(pw.value);
                        if (!ok) { alert('Incorrect password'); return; }
                        renderMenuItems();
                    });

                    pw.addEventListener('keypress', async (e) => { if (e.key === 'Enter') { const ok = await verifyAndUnlock(pw.value); if (!ok) { alert('Incorrect password'); return; } renderMenuItems(); } });

                    authBox.appendChild(pw); authBox.appendChild(unlockBtn);
                }

                menuDropdown.appendChild(authBox);

            } else {
                // Settings unlocked -> render controls and lock option
                renderSettingsControls(menuDropdown);
                const lockRow = document.createElement('div'); lockRow.className = 'settings-row';
                const lockLabel = document.createElement('div'); lockLabel.className = 'settings-label'; lockLabel.textContent = 'Lock settings';
                const lockActions = document.createElement('div'); lockActions.className = 'settings-actions';
                const lockBtn = document.createElement('button'); lockBtn.textContent = 'Lock'; lockBtn.addEventListener('click', () => { lockSettings(); renderMenuItems(); });
                lockActions.appendChild(lockBtn);
                lockRow.appendChild(lockLabel); lockRow.appendChild(lockActions);
                menuDropdown.appendChild(lockRow);
            }

            // Separator
            sep = document.createElement('hr');
            sep.style.border = 'none';
            sep.style.borderTop = '1px solid #eef6ff';
            menuDropdown.appendChild(sep);

            // list files with actions (respect setting)
            if (settings.showWorkspaceFiles) {
                workspaceFiles.forEach(file => {
                    const item = document.createElement('div');
                    item.className = 'menu-item';
                    const left = document.createElement('div');
                    left.textContent = file;
                    const right = document.createElement('div');
                    const openBtn = document.createElement('button');
                    openBtn.textContent = 'Open mini';
                    openBtn.addEventListener('click', () => openMiniBrowser(file));
                    const loadMainBtn = document.createElement('button');
                    loadMainBtn.textContent = 'Load main';
                    loadMainBtn.style.marginLeft = '0.5rem';
                    loadMainBtn.addEventListener('click', () => { toggleMenu(); loadUrl(file); });
                    right.appendChild(openBtn);
                    right.appendChild(loadMainBtn);
                    item.appendChild(left);
                    item.appendChild(right);
                    menuDropdown.appendChild(item);
                });
            }
        }

        // Default settings and persistence
        const defaultSettings = {
            showWorkspaceFiles: false,
            persistLastResults: true,
            maxMiniBrowsers: 6,
            homeBehavior: 'local', // 'last' | 'blank' | 'local'
            browserShutdown: false,
            lastPerfResults: ''
        };

        let settings = loadSettings();

        function loadSettings() {
            try {
                const raw = localStorage.getItem('operatorSettings');
                if (raw) return Object.assign({}, defaultSettings, JSON.parse(raw));
            } catch (e) {}
            return Object.assign({}, defaultSettings);
        }

        function saveSettings() {
            try { localStorage.setItem('operatorSettings', JSON.stringify(settings)); } catch (e) {}
        }

        function getAccounts() {
            try { return JSON.parse(localStorage.getItem('browserAccounts') || '{}'); } catch (e) { return {}; }
        }

        function saveAccounts(accounts) {
            try { localStorage.setItem('browserAccounts', JSON.stringify(accounts)); } catch (e) {}
        }

        function getSubmissions() {
            try { return JSON.parse(localStorage.getItem('codeSubmissions') || '[]'); } catch (e) { return []; }
        }

        function saveSubmissions(submissions) {
            try { localStorage.setItem('codeSubmissions', JSON.stringify(submissions)); } catch (e) {}
        }

        function addSubmission(submission) {
            const submissions = getSubmissions();
            submissions.unshift({ submittedAt: new Date().toLocaleString(), ...submission });
            saveSubmissions(submissions);
        }

        function getCurrentAccount() {
            try { return sessionStorage.getItem('activeAccount'); } catch (e) { return null; }
        }

        function setCurrentAccount(username) {
            try { sessionStorage.setItem('activeAccount', username); } catch (e) {}
        }

        function clearCurrentAccount() {
            try { sessionStorage.removeItem('activeAccount'); } catch (e) {}
        }

        async function createAccount(username, password, email) {
            const accounts = getAccounts();
            if (!username || !password) return { success: false, message: 'Username and password are required.' };
            if (accounts[username]) return { success: false, message: 'Account already exists.' };
            const hash = await hashString(password);
            accounts[username] = { passwordHash: hash, email: email || '', createdAt: new Date().toISOString() };
            saveAccounts(accounts);
            setCurrentAccount(username);
            return { success: true };
        }

        async function verifyAccount(username, password) {
            const accounts = getAccounts();
            const account = accounts[username];
            if (!account) return false;
            const hash = await hashString(password);
            return hash === account.passwordHash;
        }

        function getCurrentProfile() {
            const username = getCurrentAccount();
            if (!username) return null;
            const accounts = getAccounts();
            return accounts[username] ? { username, ...accounts[username] } : null;
        }

        async function changeAccountPassword(username, newPassword) {
            const accounts = getAccounts();
            if (!accounts[username]) return false;
            accounts[username].passwordHash = await hashString(newPassword);
            saveAccounts(accounts);
            return true;
        }

        function updateAccountEmail(username, email) {
            const accounts = getAccounts();
            if (!accounts[username]) return false;
            accounts[username].email = email;
            saveAccounts(accounts);
            return true;
        }

        function deleteAccount(username) {
            const accounts = getAccounts();
            if (!accounts[username]) return false;
            delete accounts[username];
            saveAccounts(accounts);
            clearCurrentAccount();
            return true;
        }

        function renderAccountSection(root) {
            const accountPanel = document.createElement('div');
            accountPanel.style.padding = '0.5rem';
            accountPanel.style.borderBottom = '1px solid #eef6ff';

            const profile = getCurrentProfile();
            const header = document.createElement('div');
            header.innerHTML = `<strong>Account</strong> ${profile ? `(signed in as ${profile.username})` : '(not signed in)'} `;
            accountPanel.appendChild(header);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.flexWrap = 'wrap';
            actions.style.gap = '0.4rem';
            actions.style.marginTop = '0.5rem';

            const createBtn = document.createElement('button');
            createBtn.textContent = 'Create Account';
            createBtn.addEventListener('click', () => renderAccountPanel('create'));
            actions.appendChild(createBtn);

            const profileBtn = document.createElement('button');
            profileBtn.textContent = 'Profile';
            profileBtn.disabled = !profile;
            profileBtn.addEventListener('click', () => renderAccountPanel('profile'));
            actions.appendChild(profileBtn);

            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = 'Account Settings';
            settingsBtn.disabled = !profile;
            settingsBtn.addEventListener('click', () => renderAccountPanel('settings'));
            actions.appendChild(settingsBtn);

            if (profile) {
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', () => { clearCurrentAccount(); renderMenuItems(); });
                actions.appendChild(logoutBtn);
            } else {
                const loginBtn = document.createElement('button');
                loginBtn.textContent = 'Login';
                loginBtn.addEventListener('click', () => renderAccountPanel('login'));
                actions.appendChild(loginBtn);
            }

            accountPanel.appendChild(actions);
            accountPanel.id = 'account-section';

            const panel = document.createElement('div');
            panel.id = 'account-panel';
            panel.style.marginTop = '0.75rem';
            accountPanel.appendChild(panel);
            root.appendChild(accountPanel);
        }

        function renderAccountPanel(mode) {
            const panel = document.getElementById('account-panel');
            if (!panel) return;
            panel.innerHTML = '';
            const profile = getCurrentProfile();

            if (mode === 'create') {
                const title = document.createElement('h3'); title.textContent = 'Create Account';
                panel.appendChild(title);
                const username = document.createElement('input'); username.type = 'text'; username.placeholder = 'Username'; username.className = 'settings-input';
                const email = document.createElement('input'); email.type = 'email'; email.placeholder = 'Email (optional)'; email.className = 'settings-input';
                const password = document.createElement('input'); password.type = 'password'; password.placeholder = 'Password'; password.className = 'settings-input';
                const confirm = document.createElement('input'); confirm.type = 'password'; confirm.placeholder = 'Confirm Password'; confirm.className = 'settings-input';
                const submit = document.createElement('button'); submit.textContent = 'Create';
                submit.addEventListener('click', async () => {
                    if (!username.value || !password.value) { alert('Username and password are required.'); return; }
                    if (password.value !== confirm.value) { alert('Passwords do not match.'); return; }
                    const result = await createAccount(username.value.trim(), password.value, email.value.trim());
                    if (!result.success) { alert(result.message); return; }
                    alert('Account created and signed in.');
                    renderMenuItems();
                });
                [username, email, password, confirm].forEach(el => { el.style.display = 'block'; el.style.width = '100%'; el.style.marginTop = '0.5rem'; panel.appendChild(el); });
                submit.style.marginTop = '0.75rem'; panel.appendChild(submit);
            } else if (mode === 'login') {
                const title = document.createElement('h3'); title.textContent = 'Login';
                panel.appendChild(title);
                const username = document.createElement('input'); username.type = 'text'; username.placeholder = 'Username'; username.className = 'settings-input';
                const password = document.createElement('input'); password.type = 'password'; password.placeholder = 'Password'; password.className = 'settings-input';
                const submit = document.createElement('button'); submit.textContent = 'Login';
                submit.addEventListener('click', async () => {
                    if (!username.value || !password.value) { alert('Username and password are required.'); return; }
                    const ok = await verifyAccount(username.value.trim(), password.value);
                    if (!ok) { alert('Login failed.'); return; }
                    setCurrentAccount(username.value.trim());
                    alert('Signed in.');
                    renderMenuItems();
                });
                [username, password].forEach(el => { el.style.display = 'block'; el.style.width = '100%'; el.style.marginTop = '0.5rem'; panel.appendChild(el); });
                submit.style.marginTop = '0.75rem'; panel.appendChild(submit);
            } else if (mode === 'profile' && profile) {
                const title = document.createElement('h3'); title.textContent = 'Profile';
                panel.appendChild(title);
                const info = document.createElement('div');
                info.innerHTML = `<p><strong>Username:</strong> ${escapeHtml(profile.username)}</p><p><strong>Email:</strong> ${escapeHtml(profile.email || '(none)')}</p><p><strong>Created:</strong> ${escapeHtml(profile.createdAt)}</p>`;
                panel.appendChild(info);
            } else if (mode === 'settings' && profile) {
                const title = document.createElement('h3'); title.textContent = 'Account Settings';
                panel.appendChild(title);
                const email = document.createElement('input'); email.type = 'email'; email.placeholder = 'Email'; email.className = 'settings-input'; email.value = profile.email || '';
                const saveEmail = document.createElement('button'); saveEmail.textContent = 'Save Email';
                saveEmail.addEventListener('click', () => {
                    updateAccountEmail(profile.username, email.value.trim());
                    alert('Email saved.');
                    renderMenuItems();
                });
                const newPass = document.createElement('input'); newPass.type = 'password'; newPass.placeholder = 'New password'; newPass.className = 'settings-input';
                const confirmPass = document.createElement('input'); confirmPass.type = 'password'; confirmPass.placeholder = 'Confirm password'; confirmPass.className = 'settings-input';
                const changePass = document.createElement('button'); changePass.textContent = 'Change Password';
                changePass.addEventListener('click', async () => {
                    if (!newPass.value) { alert('Password cannot be empty.'); return; }
                    if (newPass.value !== confirmPass.value) { alert('Passwords do not match.'); return; }
                    await changeAccountPassword(profile.username, newPass.value);
                    alert('Password changed.');
                    renderMenuItems();
                });
                const deleteBtn = document.createElement('button'); deleteBtn.textContent = 'Delete Account'; deleteBtn.style.background = '#f5d6d6';
                deleteBtn.addEventListener('click', () => {
                    if (!confirm('Delete this account? This cannot be undone.')) return;
                    deleteAccount(profile.username);
                    alert('Account deleted.');
                    renderMenuItems();
                });
                [email, saveEmail, newPass, confirmPass, changePass, deleteBtn].forEach(el => { if (el.style) { el.style.display = 'block'; el.style.width = '100%'; el.style.marginTop = '0.5rem'; } panel.appendChild(el); });
            } else {
                const note = document.createElement('div');
                note.textContent = 'Select an account action to continue.';
                note.style.padding = '0.5rem';
                panel.appendChild(note);
            }
        }

        function renderSubmissionSection(root) {
            const submissionPanel = document.createElement('div');
            submissionPanel.style.padding = '0.5rem';
            submissionPanel.style.borderBottom = '1px solid #eef6ff';

            const header = document.createElement('div');
            header.innerHTML = '<strong>Code Submissions</strong>';
            submissionPanel.appendChild(header);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.flexWrap = 'wrap';
            actions.style.gap = '0.4rem';
            actions.style.marginTop = '0.5rem';

            const submitBtn = document.createElement('button');
            submitBtn.textContent = 'Submit Code';
            submitBtn.addEventListener('click', () => renderSubmissionPanel('submit'));
            actions.appendChild(submitBtn);

            const listBtn = document.createElement('button');
            listBtn.textContent = 'View Submissions';
            listBtn.addEventListener('click', () => renderSubmissionPanel('list'));
            actions.appendChild(listBtn);

            submissionPanel.appendChild(actions);

            const panel = document.createElement('div');
            panel.id = 'submission-panel';
            panel.style.marginTop = '0.75rem';
            submissionPanel.appendChild(panel);

            root.appendChild(submissionPanel);
        }

        function renderSubmissionPanel(mode) {
            const panel = document.getElementById('submission-panel');
            if (!panel) return;
            panel.innerHTML = '';

            if (mode === 'submit') {
                const title = document.createElement('h3');
                title.textContent = 'Submit Code';
                panel.appendChild(title);

                const submitter = document.createElement('input');
                submitter.type = 'text';
                submitter.placeholder = 'Your name or handle';
                submitter.className = 'settings-input';

                const codeTitle = document.createElement('input');
                codeTitle.type = 'text';
                codeTitle.placeholder = 'Code title or feature name';
                codeTitle.className = 'settings-input';

                const description = document.createElement('textarea');
                description.placeholder = 'Describe what this code does or how it should appear in Dogi Search Results';
                description.className = 'settings-input';
                description.style.minHeight = '90px';
                description.style.width = '100%';

                const code = document.createElement('textarea');
                code.placeholder = 'Paste your code here';
                code.className = 'settings-input';
                code.style.minHeight = '160px';
                code.style.width = '100%';

                const submit = document.createElement('button');
                submit.textContent = 'Send submission';
                submit.addEventListener('click', () => {
                    if (!submitter.value.trim() || !codeTitle.value.trim() || !code.value.trim()) {
                        alert('Name, title, and code are required.');
                        return;
                    }
                    addSubmission({
                        submitter: submitter.value.trim(),
                        title: codeTitle.value.trim(),
                        description: description.value.trim(),
                        code: code.value.trim()
                    });
                    alert('Code submitted. I can now review it for Dogi Search Results.');
                    renderSubmissionPanel('list');
                });

                [submitter, codeTitle, description, code].forEach(el => {
                    el.style.display = 'block';
                    el.style.marginTop = '0.5rem';
                    panel.appendChild(el);
                });
                submit.style.marginTop = '0.75rem';
                panel.appendChild(submit);
            } else if (mode === 'list') {
                const title = document.createElement('h3');
                title.textContent = 'Submitted Code';
                panel.appendChild(title);

                const submissions = getSubmissions();
                if (submissions.length === 0) {
                    const note = document.createElement('div');
                    note.textContent = 'No code submissions have been sent yet.';
                    note.style.padding = '0.5rem';
                    panel.appendChild(note);
                    return;
                }

                submissions.forEach((item, index) => {
                    const entry = document.createElement('div');
                    entry.style.padding = '0.65rem';
                    entry.style.borderRadius = '0.75rem';
                    entry.style.marginTop = index === 0 ? '0.5rem' : '0.35rem';
                    entry.style.background = '#f8fafc';
                    entry.style.border = '1px solid #e2e8f0';

                    const header = document.createElement('div');
                    header.innerHTML = `<strong>${escapeHtml(item.title)}</strong> <span style="font-size:0.85rem;color:#4b5563;">by ${escapeHtml(item.submitter)} • ${escapeHtml(item.submittedAt)}</span>`;
                    entry.appendChild(header);

                    if (item.description) {
                        const desc = document.createElement('div');
                        desc.style.marginTop = '0.35rem';
                        desc.style.color = '#334155';
                        desc.textContent = item.description;
                        entry.appendChild(desc);
                    }

                    const codeBox = document.createElement('pre');
                    codeBox.style.marginTop = '0.75rem';
                    codeBox.style.padding = '0.75rem';
                    codeBox.style.background = '#eef2ff';
                    codeBox.style.borderRadius = '0.65rem';
                    codeBox.style.whiteSpace = 'pre-wrap';
                    codeBox.style.wordBreak = 'break-word';
                    codeBox.textContent = item.code;
                    entry.appendChild(codeBox);

                    const copyBtn = document.createElement('button');
                    copyBtn.textContent = 'Copy code';
                    copyBtn.style.marginTop = '0.6rem';
                    copyBtn.addEventListener('click', () => {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(item.code).then(() => alert('Code copied to clipboard.')).catch(() => alert('Unable to copy code.'));
                        } else {
                            alert('Clipboard not available in this browser.');
                        }
                    });
                    entry.appendChild(copyBtn);

                    panel.appendChild(entry);
                });
            } else {
                const note = document.createElement('div');
                note.textContent = 'Select a submission action to continue.';
                note.style.padding = '0.5rem';
                panel.appendChild(note);
            }
        }

        function clearLastResults() {
            try { localStorage.removeItem('lastSearchHtml'); localStorage.removeItem('lastSearchMeta'); } catch (e) {}
            browserFrame.src = 'about:blank';
            loadStatus.textContent = '';
            currentUrlSpan.textContent = 'Home';
        }

        function updateBrowserControlsState() {
            const disabled = settings.browserShutdown;
            [backBtn, forwardBtn, refreshBtn, homeBtn, loadButton, addressBar].forEach(el => { if (el) el.disabled = disabled; });
            if (disabled) {
                loadStatus.textContent = 'Browser is shut down';
                currentUrlSpan.textContent = 'Browser shut down';
            }
        }

        function shutdownBrowser() {
            settings.browserShutdown = true;
            saveSettings();
            browserFrame.src = 'about:blank';
            updateBrowserControlsState();
            alert('Browser has been shut down. Restart from Operator Settings.');
        }

        function restartBrowser() {
            settings.browserShutdown = false;
            saveSettings();
            updateBrowserControlsState();
            loadHomePage();
            alert('Browser restarted.');
        }

        function getReportedIssues() {
            try { return JSON.parse(localStorage.getItem('reportedIssues') || '[]'); } catch (e) { return []; }
        }

        function saveReportedIssues(issues) {
            try { localStorage.setItem('reportedIssues', JSON.stringify(issues)); } catch (e) {}
        }

        function showReportedIssues(root) {
            const panel = document.getElementById('operator-issue-panel');
            if (!panel) return;
            panel.innerHTML = '';
            const issues = getReportedIssues();
            const title = document.createElement('h3');
            title.textContent = 'Reported Issues';
            panel.appendChild(title);
            if (issues.length === 0) {
                const note = document.createElement('div');
                note.textContent = 'No reported issues yet.';
                note.style.padding = '0.5rem';
                panel.appendChild(note);
                return;
            }
            issues.forEach((issue) => {
                const entry = document.createElement('div');
                entry.style.padding = '0.75rem';
                entry.style.marginTop = '0.5rem';
                entry.style.border = '1px solid #dbeafe';
                entry.style.borderRadius = '0.75rem';
                entry.style.background = '#f8fafc';
                entry.innerHTML = `<strong>${escapeHtml(issue.title)}</strong> <span style="color:#475569;font-size:0.9rem;">(${escapeHtml(issue.status)})</span><p style="margin:0.5rem 0;color:#334155;">${escapeHtml(issue.description)}</p><div style="font-size:0.8rem;color:#64748b;">Reported: ${escapeHtml(issue.reportedAt || 'unknown')}</div>`;
                panel.appendChild(entry);
            });
        }

        async function runPerformanceTests() {
            const tests = [];
            const cpuStart = performance.now();
            let value = 0;
            for (let i = 0; i < 120000; i++) {
                value += Math.sqrt(i) * Math.sin(i);
            }
            const cpuDuration = performance.now() - cpuStart;
            tests.push(`CPU loop: ${cpuDuration.toFixed(1)} ms`);

            const domStart = performance.now();
            const temp = document.createElement('div');
            for (let i = 0; i < 140; i++) {
                const item = document.createElement('div');
                item.textContent = `Test ${i}`;
                temp.appendChild(item);
            }
            const domDuration = performance.now() - domStart;
            tests.push(`DOM prep: ${domDuration.toFixed(1)} ms`);

            const result = `Performance test complete: ${tests.join(' | ')}`;
            settings.lastPerfResults = result;
            saveSettings();
            return result;
        }

        function renderSettingsControls(root) {
            // showWorkspaceFiles toggle
            const row1 = document.createElement('div');
            row1.className = 'settings-row';
            const label1 = document.createElement('div');
            label1.className = 'settings-label';
            label1.textContent = 'Show workspace files';
            const actions1 = document.createElement('div');
            actions1.className = 'settings-actions';
            const chk1 = document.createElement('input'); chk1.type = 'checkbox'; chk1.checked = settings.showWorkspaceFiles;
            chk1.addEventListener('change', () => { settings.showWorkspaceFiles = chk1.checked; saveSettings(); renderMenuItems(); });
            actions1.appendChild(chk1);
            row1.appendChild(label1); row1.appendChild(actions1);
            root.appendChild(row1);

            // persistLastResults toggle
            const row2 = document.createElement('div');
            row2.className = 'settings-row';
            const label2 = document.createElement('div');
            label2.className = 'settings-label';
            label2.textContent = 'Persist last results';
            const actions2 = document.createElement('div');
            actions2.className = 'settings-actions';
            const chk2 = document.createElement('input'); chk2.type = 'checkbox'; chk2.checked = settings.persistLastResults;
            chk2.addEventListener('change', () => { settings.persistLastResults = chk2.checked; saveSettings(); });
            actions2.appendChild(chk2);
            row2.appendChild(label2); row2.appendChild(actions2);
            root.appendChild(row2);

            // maxMiniBrowsers input
            const row3 = document.createElement('div');
            row3.className = 'settings-row';
            const label3 = document.createElement('div');
            label3.className = 'settings-label';
            label3.textContent = 'Max mini browsers';
            const actions3 = document.createElement('div');
            actions3.className = 'settings-actions';
            const num = document.createElement('input'); num.type = 'number'; num.min = 1; num.max = 20; num.value = settings.maxMiniBrowsers; num.className = 'settings-input';
            num.addEventListener('change', () => { settings.maxMiniBrowsers = Math.max(1, Number(num.value) || 1); saveSettings(); });
            actions3.appendChild(num);
            row3.appendChild(label3); row3.appendChild(actions3);
            root.appendChild(row3);

            // homeBehavior select
            const row4 = document.createElement('div');
            row4.className = 'settings-row';
            const label4 = document.createElement('div');
            label4.className = 'settings-label';
            label4.textContent = 'Home behavior';
            const actions4 = document.createElement('div');
            actions4.className = 'settings-actions';
            const sel = document.createElement('select'); sel.className = 'settings-input';
            ['last','blank','local'].forEach(v => { const opt = document.createElement('option'); opt.value = v; opt.textContent = v; sel.appendChild(opt); });
            sel.value = settings.homeBehavior;
            sel.addEventListener('change', () => { settings.homeBehavior = sel.value; saveSettings(); });
            actions4.appendChild(sel);
            row4.appendChild(label4); row4.appendChild(actions4);
            root.appendChild(row4);

            // Clear last results button
            const row5 = document.createElement('div');
            row5.className = 'settings-row';
            const label5 = document.createElement('div'); label5.className = 'settings-label'; label5.textContent = 'Last results';
            const actions5 = document.createElement('div'); actions5.className = 'settings-actions';
            const clearBtn = document.createElement('button'); clearBtn.textContent = 'Clear';
            clearBtn.addEventListener('click', () => { clearLastResults(); renderMenuItems(); });
            actions5.appendChild(clearBtn);
            row5.appendChild(label5); row5.appendChild(actions5);
            root.appendChild(row5);

            // Add a lock status display when unlocked
            const statusRow = document.createElement('div'); statusRow.className = 'settings-row';
            const statusLabel = document.createElement('div'); statusLabel.className = 'settings-label'; statusLabel.textContent = 'Settings status';
            const statusActions = document.createElement('div'); statusActions.className = 'settings-actions';
            const lockInfo = document.createElement('div'); lockInfo.textContent = 'Unlocked'; lockInfo.style.color = '#0b6f3a';
            statusActions.appendChild(lockInfo);
            statusRow.appendChild(statusLabel); statusRow.appendChild(statusActions);
            root.appendChild(statusRow);

            // Operator action controls
            const actionRow = document.createElement('div');
            actionRow.className = 'settings-row';
            const actionLabel = document.createElement('div');
            actionLabel.className = 'settings-label';
            actionLabel.textContent = 'Operator actions';
            const actionButtons = document.createElement('div');
            actionButtons.className = 'settings-actions';
            const shutdownBtn = document.createElement('button');
            shutdownBtn.textContent = settings.browserShutdown ? 'Restart browser' : 'Shut down browser';
            shutdownBtn.addEventListener('click', () => {
                if (settings.browserShutdown) restartBrowser(); else shutdownBrowser();
                renderMenuItems();
            });
            const issueBtn = document.createElement('button');
            issueBtn.textContent = 'Reported Issues';
            issueBtn.addEventListener('click', () => showReportedIssues(root));
            const profileBtn = document.createElement('button');
            profileBtn.textContent = 'Profile Management';
            profileBtn.addEventListener('click', () => {
                renderAccountPanel('settings');
                alert('Opened user profile management.');
            });
            const perfBtn = document.createElement('button');
            perfBtn.textContent = 'Run Performance Tests';
            perfBtn.addEventListener('click', async () => {
                const result = await runPerformanceTests();
                perfStatus.textContent = result;
            });
            actionButtons.appendChild(shutdownBtn);
            actionButtons.appendChild(issueBtn);
            actionButtons.appendChild(profileBtn);
            actionButtons.appendChild(perfBtn);
            actionRow.appendChild(actionLabel);
            actionRow.appendChild(actionButtons);
            root.appendChild(actionRow);

            const perfRow = document.createElement('div');
            perfRow.className = 'settings-row';
            const perfLabel = document.createElement('div');
            perfLabel.className = 'settings-label';
            perfLabel.textContent = 'Performance result';
            const perfActions = document.createElement('div');
            perfActions.className = 'settings-actions';
            const perfStatus = document.createElement('div');
            perfStatus.style.maxWidth = '420px';
            perfStatus.style.wordBreak = 'break-word';
            perfStatus.textContent = settings.lastPerfResults || 'No results yet.';
            perfActions.appendChild(perfStatus);
            perfRow.appendChild(perfLabel);
            perfRow.appendChild(perfActions);
            root.appendChild(perfRow);

            const issuePanel = document.createElement('div');
            issuePanel.id = 'operator-issue-panel';
            issuePanel.style.marginTop = '0.75rem';
            root.appendChild(issuePanel);
        }

        function openMiniBrowser(file) {
            // create card with header and iframe
            // enforce max mini browsers
            const existing = menuDropdown.querySelectorAll('.mini-browser-card').length;
            if (existing >= settings.maxMiniBrowsers) {
                alert('Max mini browsers reached (' + settings.maxMiniBrowsers + ')');
                return;
            }

            const card = document.createElement('div');
            card.className = 'mini-browser-card';
            const header = document.createElement('div');
            header.className = 'mini-browser-header';
            const title = document.createElement('div');
            title.textContent = file;
            const actions = document.createElement('div');
            actions.style.marginLeft = 'auto';
            const openMain = document.createElement('button');
            openMain.textContent = 'Open';
            openMain.addEventListener('click', () => { loadUrl(file); });
            const close = document.createElement('button');
            close.textContent = 'Close';
            close.style.marginLeft = '0.4rem';
            close.addEventListener('click', () => card.remove());
            actions.appendChild(openMain);
            actions.appendChild(close);
            header.appendChild(title);
            header.appendChild(actions);
            const iframe = document.createElement('iframe');
            iframe.className = 'mini-browser-iframe';
            // allow srcdoc for local files if CORS blocks fetch; attempt to fetch and fallback to src
            fetch(file).then(r => r.ok ? r.text().then(t => { iframe.srcdoc = t; }) : (iframe.src = file)).catch(_ => { iframe.src = file; });
            card.appendChild(header);
            card.appendChild(iframe);
            menuDropdown.appendChild(card);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                menuDropdown.style.display = 'none';
                menuDropdown.setAttribute('aria-hidden', 'true');
            }
        });

        // --- Password protection helpers for operator settings ---
        function getStoredPasswordHash() {
            try { return localStorage.getItem('operatorPassHash'); } catch (e) { return null; }
        }

        async function hashString(s) {
            if (!s) return null;
            const enc = new TextEncoder().encode(s);
            const buf = await crypto.subtle.digest('SHA-256', enc);
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        async function setPassword(pass) {
            const h = await hashString(pass);
            try { localStorage.setItem('operatorPassHash', h); sessionStorage.setItem('settingsUnlocked', '1'); } catch (e) {}
            alert('Operator password set. Settings unlocked for this session.');
        }

        async function verifyAndUnlock(pass) {
            const stored = getStoredPasswordHash();
            if (!stored) return false;
            const h = await hashString(pass);
            if (h === stored) {
                try { sessionStorage.setItem('settingsUnlocked', '1'); } catch (e) {}
                return true;
            }
            return false;
        }

        function isSettingsUnlocked() {
            try { return sessionStorage.getItem('settingsUnlocked') === '1'; } catch (e) { return false; }
        }

        function lockSettings() {
            try { sessionStorage.removeItem('settingsUnlocked'); } catch (e) {}
            alert('Settings locked for this session.');
        }

        function goBack() {
            if (currentIndex > 0) {
                currentIndex--;
                const url = history[currentIndex];
                addressBar.value = url;
                currentUrlSpan.textContent = url;
                browserFrame.src = url;
                updateNavButtons();
            }
        }

        function goForward() {
            if (currentIndex < history.length - 1) {
                currentIndex++;
                const url = history[currentIndex];
                addressBar.value = url;
                currentUrlSpan.textContent = url;
                browserFrame.src = url;
                updateNavButtons();
            }
        }

        function refresh() {
            if (history.length > 0) {
                const url = history[currentIndex];
                loadStatus.textContent = 'Reloading...';
                browserFrame.onload = () => {
                    loadStatus.textContent = 'Ready';
                };
                browserFrame.src = url + '?cache-bust=' + Date.now();
            }
        }

        function showError(message) {
            browserFrame.srcdoc = `
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 2rem; }
                        .error { color: #c92a2a; background: #ffe0e0; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #c92a2a; }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h2>Error</h2>
                        <p>${message}</p>
                    </div>
                </body>
                </html>
            `;
        }

        function handleBrowserShortcut(e) {
            const key = e.key.toLowerCase();
            const modifier = e.ctrlKey || e.metaKey;

            if (modifier && (key === 'l' || key === 'k')) {
                e.preventDefault();
                addressBar.focus();
                addressBar.select();
                return true;
            }

            if (modifier && (key === 'r' || key === 'f5')) {
                e.preventDefault();
                refresh();
                return true;
            }

            if (e.altKey && key === 'arrowleft') {
                e.preventDefault();
                goBack();
                return true;
            }

            if (e.altKey && key === 'arrowright') {
                e.preventDefault();
                goForward();
                return true;
            }

            if (key === '/') {
                e.preventDefault();
                addressBar.focus();
                addressBar.select();
                return true;
            }

            if (e.key === 'Escape') {
                addressBar.value = '';
                loadStatus.textContent = 'Search cleared';
                return true;
            }

            return false;
        }

        // Event listeners
        backBtn.addEventListener('click', goBack);
        forwardBtn.addEventListener('click', goForward);
        refreshBtn.addEventListener('click', refresh);
        homeBtn.addEventListener('click', loadHomePage);
        loadButton.addEventListener('click', () => {
            const term = addressBar.value.trim();
            if (term) runWorkspaceSearch(term);
        });

        addressBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const term = addressBar.value.trim();
                if (term) runWorkspaceSearch(term);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (handleBrowserShortcut(e)) {
                return;
            }
        });

        initializeDogiOS();

        // Load home page on startup
        loadHomePage();
