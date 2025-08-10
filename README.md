# MMMeadBot

This is a Discord bot built with discord.js and TypeScript. The bot pulls commands from a MongoDB database and generates responses based on a list of commands that start with `!`. It can assign users roles and provides a welcome message when a new member joins the server.

## Features

- **Command Handling**: Responds to commands starting with `!`.
- **Role Assignment**: Assigns roles to users.
- **Welcome Message**: Sends a welcome message to new members.

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- Node.js (>= 14.x)
- npm or yarn
- MongoDB instance (local or remote)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ljreaux/MMMeadBot.git
   cd MMMeadBot
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1.  Create a `.env` file in the root of the project and add the following environment variables:

         ```dotenv
         token=<your-discord-bot-token>
         CLIENT_ID=<your-discord-client-id>
         GUILD_ID=<your-discord-guild-id>
         WELCOME_CHANNEL=<your-welcome-channel-id>
         BOT_SPAM_CHANNEL=<your-bot-spam-channel-id>
         MONGO_URI=<your-mongodb-connection-string>
         ```

    Replace `<your-discord-bot-token>`, `<your-discord-client-id>`, `<your-discord-guild-id>`, `<your-welcome-channel-id>`, `<your-bot-spam-channel-id>`, and `<your-mongodb-connection-string>` with your actual Discord bot token, Discord client ID, Discord guild ID, IDs for welcome channel and bot spam channel, and MongoDB connection string.

### Running the Bot

- ```bash
  npm start
  # or
  yarn start
  ```

### Usage

- **Commands:** Use !list to trigger a command to get a list of available commands.
- **Role Assignment:** The bot can automatically assign roles based on predefined commands.
- **Welcome Message:** The bot sends a welcome message whenever a new member joins the server.

### Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request.

### License

This project is licensed under the MIT License.
