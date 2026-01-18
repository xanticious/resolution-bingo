// Help Page
export class HelpPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'Help';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page help-page';
    container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Help & Documentation</h1>
                <p class="page-description">Learn how to use Resolution Bingo</p>
            </div>

            <div class="help-section">
                <h2>What is Resolution Bingo?</h2>
                <p>
                    Resolution Bingo is a fun, ADHD-friendly web application that helps you gamify 
                    your New Year's resolutions. Create customizable bingo cards filled with your 
                    personal goals, print them out, and enjoy tracking your progress in a visual, 
                    engaging way.
                </p>
            </div>

            <div class="help-section">
                <h2>Managing Resolutions</h2>
                <h3>Adding a Resolution</h3>
                <ul>
                    <li>Go to the Resolutions page</li>
                    <li>Click "Add Resolution"</li>
                    <li>Enter your resolution text (up to 1000 characters)</li>
                    <li>Choose frequency type:
                        <ul>
                            <li><strong>Single Occurrence:</strong> One-time goal (e.g., "Publish a book this year")</li>
                            <li><strong>Number of Times:</strong> Do something X times total (e.g., "Read 10 books this year")</li>
                            <li><strong>Number per Duration:</strong> Do something X times per week/month/year (e.g., "Exercise 5 times per week")</li>
                        </ul>
                    </li>
                    <li>Select your excitement level (1-5)</li>
                    <li>Pick a life category</li>
                    <li>Save automatically!</li>
                </ul>

                <h3>Organizing Resolutions</h3>
                <ul>
                    <li><strong>View Modes:</strong> Switch between Cards, Table, or List view</li>
                    <li><strong>Filter:</strong> Filter by frequency, excitement level, or category</li>
                    <li><strong>Sort:</strong> In table view, sort by any column</li>
                    <li><strong>Edit Mode:</strong> Drag and drop to reorder your resolutions</li>
                </ul>
            </div>

            <div class="help-section">
                <h2>Creating Bingo Cards</h2>
                <h3>Steps to Create a Card</h3>
                <ol>
                    <li>Click "Create Bingo Card" from the Resolutions page</li>
                    <li>Enter a save name (internal reference)</li>
                    <li>Enter a printed title (appears on the card)</li>
                    <li>Select up to 25 resolutions (unfilled squares become "Free")</li>
                    <li>Choose a design theme (Flowers, Cute, Science, Mathy, Animals)</li>
                    <li>Pick a font style (Silly, Fancy, Writer, Headlines)</li>
                    <li>Click "Shuffle" to randomize positions</li>
                    <li>Drag and drop squares to customize layout</li>
                    <li>Click any square to edit the bingo phrase</li>
                    <li>Save your card!</li>
                </ol>

                <h3>Design Themes</h3>
                <ul>
                    <li><strong>Flowers:</strong> Floral patterns and soft pastels</li>
                    <li><strong>Cute:</strong> Stars, hearts, and bright colors</li>
                    <li><strong>Science:</strong> Technical aesthetic with lab equipment</li>
                    <li><strong>Mathy:</strong> Graph paper style with geometric patterns</li>
                    <li><strong>Animals:</strong> Paw prints and earthy tones</li>
                </ul>
            </div>

            <div class="help-section">
                <h2>Printing Your Cards</h2>
                <p>Resolution Bingo cards are designed to be printed and used as physical trackers:</p>
                <ul>
                    <li>View any saved card</li>
                    <li>Choose your card size (Full Page, 5x5, 6x6, or 7x7 inches)</li>
                    <li>Select Color or Grayscale mode</li>
                    <li>Click "Print Card" to open your browser's print dialog</li>
                    <li>You can print to paper or save as PDF</li>
                </ul>
                <p><strong>Tip:</strong> Filter by "Single Occurrence" resolutions when creating 
                cards, since those can be crossed off once completed!</p>
            </div>

            <div class="help-section">
                <h2>Multiple Profiles</h2>
                <p>
                    Resolution Bingo supports multiple profiles - perfect for families!
                </p>
                <ul>
                    <li>Each person has their own resolutions, cards, and categories</li>
                    <li>Create new profiles in Settings</li>
                    <li>Switch between profiles anytime</li>
                    <li>All data is kept completely separate</li>
                </ul>
            </div>

            <div class="help-section">
                <h2>Backing Up Your Data</h2>
                <p>
                    Your data is stored in your browser's local storage. For safety, 
                    we recommend exporting regularly:
                </p>
                <ul>
                    <li>Go to Settings</li>
                    <li>Click "Export Data"</li>
                    <li>Save the JSON file somewhere safe</li>
                    <li>To restore, click "Import Data" and select your backup file</li>
                </ul>
                <p><strong>Note:</strong> Imported data will merge with existing data, 
                keeping the most recent version of each item.</p>
            </div>

            <div class="help-section">
                <h2>Tips for Success</h2>
                <ul>
                    <li>Start with 10-15 resolutions to get a feel for the app</li>
                    <li>Use life categories to organize different areas of your life</li>
                    <li>Be honest about excitement levels - it helps with filtering</li>
                    <li>Print multiple cards with different themes to keep things fresh</li>
                    <li>Put your bingo card somewhere visible (fridge, desk, wall)</li>
                    <li>Don't be afraid to adjust resolutions as the year progresses</li>
                    <li>Celebrate each square you cross off!</li>
                </ul>
            </div>

            <div class="help-section">
                <h2>Future Features</h2>
                <p>Coming in future updates:</p>
                <ul>
                    <li><strong>Achievement Tree:</strong> Visual tracker where you add leaves weekly</li>
                    <li><strong>Sticker Map:</strong> Travel-style passport for ongoing goals</li>
                    <li><strong>Warrior Armor:</strong> Gamify dreaded tasks by building armor</li>
                    <li>More themes and fonts</li>
                    <li>Mobile-optimized version</li>
                </ul>
            </div>

            <div class="help-section">
                <h2>Need More Help?</h2>
                <p>
                    Have questions or found a bug? The app is designed to be intuitive, 
                    but if you're stuck, try exploring the different pages and features. 
                    Remember: all changes auto-save, so feel free to experiment!
                </p>
            </div>

            <div class="help-section">
                <h2>Credits</h2>
                <p>
                    All emojis designed by <a href="https://openmoji.org/" target="_blank" rel="noopener">OpenMoji</a> – 
                    the open-source emoji and icon project. License: 
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>
                </p>
            </div>
        `;

    return container;
  }

  mount() {
    // Event listeners
  }

  unmount() {
    // Cleanup
  }
}
