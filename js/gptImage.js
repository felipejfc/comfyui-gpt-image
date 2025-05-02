import { app } from "../../scripts/app.js";

// Function to calculate estimated cost
function calculateCost(quality, n) {
    const costs = {
        "low": 0.01,
        "medium": 0.04,
        "high": 0.17
    };
    const costPerImage = costs[quality] || 0.01; // Default to low cost
    return (costPerImage * n).toFixed(2); // Format to 2 decimal places
}

// Add cost estimator widget to the node
app.registerExtension({
    name: "fjfca.GPTImage1Generate.CostEstimator",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "GPTImage1Generate") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;

                // Find the quality and n widgets
                const qualityWidget = this.widgets.find(w => w.name === "quality");
                const nWidget = this.widgets.find(w => w.name === "n");

                // Add the text widget for cost display
                const costWidget = this.addWidget("text", "estimated_cost", "Est. Cost: $0.00", () => { }, {});
                costWidget.serializeValue = false; // Don't save this widget value

                // Function to update the cost widget
                const updateCost = () => {
                    if (qualityWidget && nWidget) {
                        const quality = qualityWidget.value;
                        const n = nWidget.value;
                        const estimatedCost = calculateCost(quality, n);
                        costWidget.value = `Est. Cost: $${estimatedCost}`;
                        // Force redraw if necessary, depending on ComfyUI version/behavior
                         if (this.graph && this.graph.setDirtyCanvas) {
                           this.graph.setDirtyCanvas(true, true);
                         }
                    }
                };

                // Add event listeners to quality and n widgets
                if (qualityWidget) {
                    const originalCallback = qualityWidget.callback;
                    qualityWidget.callback = (value) => {
                        if (originalCallback) {
                            originalCallback.call(this, value);
                        }
                        updateCost();
                    };
                }

                if (nWidget) {
                     // Store original widget properties/callback if needed
                    const originalNCallback = nWidget.callback;
                    nWidget.callback = (value) => {
                        // Optional: Call original callback if it exists
                         if (originalNCallback) {
                             // Call original callback with the widget as context ('this')
                             originalNCallback.call(nWidget, value);
                         }
                         updateCost();
                     };

                     // Also handle direct input changes if the widget supports it (e.g., text input)
                     if (nWidget.inputEl) {
                         nWidget.inputEl.addEventListener('input', () => {
                             // Ensure the widget's value is updated from the input element
                             nWidget.value = parseFloat(nWidget.inputEl.value) || 1; // Update internal value
                             updateCost();
                         });
                     }
                }

                // Initial calculation
                updateCost();

                return r;
            };
        }
    },
}); 