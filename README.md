# Intelligent Student Learning Assistant Using Agentic AI

LearnFlow is a dependency-free browser prototype based on the supplied project report. It demonstrates an agentic learning workflow through:

- Personalized study planning from goals, time, and current focus
- Daily task completion with local progress persistence
- Adaptive subject mastery and learning-streak overview
- AI-style focus recommendations
- A three-question practice session with feedback
- Curated learning resources

## Run locally

Open `index.html` in a browser. No package installation or server is required.

The demo stores progress in the browser's local storage. Use **Reset demo data** in the sidebar to return to the starting state.

## Production extension points

The current interface uses local mock data so it works offline. For a production implementation, the functions in `app.js` can be connected to:

- A backend API for student profiles, study plans, quiz attempts, and analytics
- An LLM/agent orchestration service for plan generation and resource recommendations
- MongoDB or MySQL for durable student and progress data
- Educational resource and learning-management-system APIs
