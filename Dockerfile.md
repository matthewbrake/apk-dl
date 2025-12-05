# Dockerfile

Run the command in the README to copy this content to `Dockerfile`.

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 1. Install Dependencies
COPY package.json .
# We use legacy-peer-deps to ignore potential conflicts with react-scripts/react-18
RUN npm install --legacy-peer-deps

# 2. Copy Source Code
COPY . .

# 3. AUTO-FIX FILE STRUCTURE
# React Scripts (CRA) strictly requires:
# - HTML in /public
# - Code in /src
# Since your files are flat, we move them now.
RUN mkdir -p public src/components src/docs

# Move HTML and Metadata to public
RUN mv index.html metadata.json public/ 2>/dev/null || true

# Move Source files to src
RUN mv *.tsx *.ts src/ 2>/dev/null || true
RUN mv simulated_data.ts src/ 2>/dev/null || true

# Move Component folders (if they exist in root)
RUN cp -r components/* src/components/ 2>/dev/null || true && rm -rf components
RUN cp -r docs/* src/docs/ 2>/dev/null || true && rm -rf docs

# 4. Build the App
RUN npm run build

# 5. Serve with lightweight Node server on Port 3050
RUN npm install -g serve
EXPOSE 3050

CMD ["serve", "-s", "build", "-l", "3050"]
```