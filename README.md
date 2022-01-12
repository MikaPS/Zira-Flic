# Zira-Flic
Flic integration with Zira

A flic click represents a production of 1 unit in the operator's work cell.

This code runs on the Flic hub (https://flic.io/flic-hub-sdk).
When clicking on a Flic button, a new reading will be posted to a corresponding Zira form based on the button's name.
The code supports multiple buttons. On each click, the hub make request for "get data-sources list" to find the form's meter ID.
Then, perform "get reading" to find the lastest run number and employee ID.
Post a new reading in the form with correct run number, meter id, and 1 unit.
