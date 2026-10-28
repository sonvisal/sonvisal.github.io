# Recommended free deployment: Vue + Spring Boot + PostgreSQL

For your stack, I recommend GitHub Pages for Vue, Render for the Spring Boot API, and Neon for PostgreSQL.

This keeps your frontend, backend, and database separate. It is a good starting architecture for a portfolio, learning project, or small demo. Free-tier limits can change, so verify them before deployment.

Vue.js frontend

GitHub Pages · Free

`username.github.io/my-app/`

HTTPS REST API · JSON

Spring Boot backend

Render · Free web service

REST controllers · Validation · Authentication

JDBC / SSL database connection

PostgreSQL database

Neon · Free tier

Private credentials · Persistent database service

Useful official documentation:

- [GitHub Pages documentation](https://docs.github.com/en/pages?utm_source=chatgpt.com)
- [Render deployment documentation](https://render.com/docs?utm_source=chatgpt.com)
- [Neon PostgreSQL documentation](https://neon.com/docs?utm_source=chatgpt.com)

Render offers free web services but spins them down after 15 minutes without incoming traffic. Neon offers a free PostgreSQL tier with usage and storage limits. These are suitable for experimentation, not a production banking or payment system.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://render.com\&sz=32)

Render Docs+2



## 1. Prepare your project

You can keep the frontend and backend in separate GitHub repositories:

```
my-app-frontend/
  src/
  public/
  package.json
  vite.config.js

my-app-backend/
  src/main/java/
  src/main/resources/
    application.properties
  pom.xml
```

This separation makes deployment and access control easier to manage.

## 2. Deploy the Vue frontend to GitHub Pages

### Step 2.1 — Create a Vue project

Install Node.js, then run:

```
npm create vite@latest my-app-frontend -- --template vue
cd my-app-frontend
npm install
npm run dev
```

Open the local URL printed by Vite to confirm the site works.

### Step 2.2 — Configure the deployment path

Edit `vite.config.js`.

If your repository is named `my-app-frontend`, your site will normally be hosted at `https://YOUR_USERNAME.github.io/my-app-frontend/`.

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/my-app-frontend/'
})
```

Use `base: '/'` if the repository is named `YOUR_USERNAME.github.io` or you use a custom domain.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://vite.dev\&sz=32)

Vite+1



### Step 2.3 — Deploy automatically using GitHub Actions

1. Create a public GitHub repository named `my-app-frontend`.
2. Push your Vue project to its `main` branch.
3. Open Settings → Pages and select GitHub Actions as the deployment source.
4. Create this workflow file:

`.github/workflows/deploy.yml`

```

name: Deploy Vue to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4

```

5\. Commit and push the workflow. Check the Actions tab for a successful deployment.

The workflow follows Vite's GitHub Pages deployment approach. For stronger supply-chain security, pin third-party Actions to reviewed full commit SHAs before using this in a serious project.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://vite.dev\&sz=32)

Vite+1



## 3. Create the PostgreSQL database on Neon

1. Open [Neon](https://neon.com/?utm_source=chatgpt.com) and create an account.
2. Create a PostgreSQL project.
3. Select the database and branch, then open the connection details.
4. Copy the connection string. It should resemble:

```
jdbc:postgresql://HOST/DB_NAME?sslmode=require
```

Use the actual host, database name, username, and password supplied by Neon. The standard PostgreSQL JDBC driver can connect to Neon.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub+1



Important: Do not put this connection string in your Vue code or GitHub repository. Only the backend should use it.

## 4. Configure Spring Boot

Create a Spring Boot project using [Spring Initializr](https://start.spring.io/?utm_source=chatgpt.com).

Recommended dependencies:

- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Spring Boot Validation
- Spring Security, if the API needs authentication

### Step 4.1 — Configure Maven

Ensure `pom.xml` contains the PostgreSQL driver:

```
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Step 4.2 — Configure database properties

Use environment variables instead of committing database credentials.

`src/main/resources/application.properties`

```
server.port=${PORT:8080}

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.datasource.hikari.maximum-pool-size=3

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
```

For a new demo, `ddl-auto=validate` requires the tables to exist first. Use Flyway or Liquibase to manage schema creation and migrations. For a throwaway prototype, `update` can be convenient, but it should not replace controlled migrations.

### Step 4.3 — Create a Dockerfile

Render supports Docker deployments for Java applications.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://render.com\&sz=32)

Render Docs+1



Create `Dockerfile` in the backend repository:

```

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 10000

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

```

This example assumes your project builds with Java 21 and produces one executable JAR. Adjust the Java version to match your project. The `server.port=${PORT:8080}` property allows Spring Boot to listen on Render's assigned port.

## 5. Deploy Spring Boot on Render

[Deploy Alpaca’s MCP Server Remotely on Claude Mobile](https://images.openai.com/static-rsc-4/m6K29WPo_0fZuZWOJ2Y_Az0j981DN3uJXAvPf44Gqbnnq5aNAKnLT1FXqtoFm9XIq3FVlA3mTUlelPZXBCB8_8cUahboyWgW7TyaSnATdaVTSi5XReU1s-ZY_RK0UZ9CUNnFMJlBItYOnPSLI62sv68Y_Y8JRR1D46oMsfLziB0?purpose=inline)

Step 1 — Create the service

Open [Render Dashboard](https://dashboard.render.com/?utm_source=chatgpt.com). Select New → Web Service and connect your backend GitHub repository.

[Free Hosting Bliss: Deploying Your Spring Boot App on Render | by Mahesh Babu | JavaToDev | Medium](https://images.openai.com/static-rsc-4/9a8uDhzBTDB2DOfFaFC3PQDFgQqIyuM8954Gw0LI6WDmP8AHAZvovULjUcuj9-7osiVbo009CiU07k03GqO-xEQ5YnHg6FAOngYPW6gRenjTDMOmBxyZCrh6Or2QNXTNRF8NLwdQQGh3-nKa7q3II6NW5mtKrd6B1O-cGtjiR1U?purpose=inline)

Step 2 — Configure Docker

Select Docker as the runtime and set the Dockerfile path to `./Dockerfile`. Choose the Free plan if available for your account.

[Environment Variables and Secrets – Render Docs](https://images.openai.com/static-rsc-4/QldmZH9cZQQyN-Q5PpuvKxrZaauKuIdCiqY3rUkBBbqJbF-_2IOg6czh62p9VqMyp8VY8bZZadWrDw82mXnhdRW_R1JoObico4AkJP7hUThG4VIiA5ts08AKS1u7HCVjnM9291NjsJY2PbXUZrjNGY55bOJr2O_pEhPXor2zj3M?purpose=inline)

Step 3 — Add environment variables

Add `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` under the service's environment settings. Use the Neon connection details.

After the first deployment, Render gives you an API URL similar to:

`https://my-app-api.onrender.com`

Add a simple health endpoint such as `GET /api/health`, then check the URL in your browser or with curl.

```
curl -i https://my-app-api.onrender.com/api/health
```

Your API should return HTTP 200 when healthy. Configure Render's health check path to `/api/health` if you implement that endpoint.

## 6. Connect Vue to Spring Boot

Create a `.env.production` file in the Vue repository:

```
VITE_API_BASE_URL=https://my-app-api.onrender.com
```

Vite exposes variables prefixed with `VITE_` to browser code, so never put secrets in them.

For example, in `src/services/api.js`:

```
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/health`
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
```

You can call `getHealth()` from a Vue component and display the returned status. After changing the environment variable, rebuild and redeploy the frontend.

## 7. Configure CORS and HTTPS

Your frontend and backend have different origins, so the browser will enforce CORS.

For a public demo API, a Spring Boot configuration can explicitly allow your GitHub Pages origin:

```
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(
                    CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "https://YOUR_USERNAME.github.io"
                    )
                    .allowedMethods(
                        "GET", "POST", "PUT", "DELETE"
                    )
                    .allowedHeaders("Content-Type",
                                    "Authorization");
            }
        };
    }
}
```

Replace `YOUR_USERNAME` with your actual GitHub username. If you enable Spring Security, configure CORS in the security filter chain as well; the MVC configuration alone may not be sufficient.

For HTTPS:

- GitHub Pages provides HTTPS for its `github.io` sites.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://docs.github.com\&sz=32)

  GitHub Docs

- Render provides managed TLS for public web services.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://render.com\&sz=32)

  Render Docs

- Keep Neon SSL enabled using the connection details supplied by the provider.

## 8. Security checklist

Before making the project public, verify these items:

- Keep database credentials and JWT signing keys in backend environment variables.
- Add authentication and authorization to private API endpoints.
- Validate all incoming requests on the server.
- Use parameterized queries or Spring Data JPA rather than concatenating SQL strings.
- Restrict CORS to the exact frontend origin; CORS is not authentication.
- Apply rate limits and sensible request-size limits.
- Keep dependencies and Docker base images updated.
- Use database migrations and maintain backups or exports.
- Never expose personal, financial, or sensitive information in a public repository or logs.

## 9. Understand the free-tier limitations

| Service      | What to expect                                                                             |
| ------------ | ------------------------------------------------------------------------------------------ |
| GitHub Pages | Static frontend only                                                                       |
| Render Free  | Service may sleep after 15 minutes idle; first request after sleep may take about a minute |
| Neon Free    | Limited database storage and compute; check current quotas                                 |
| Overall      | Not suitable for guaranteed uptime, production payments, or critical banking workloads     |

Render's free PostgreSQL option expires after 30 days, so Neon is a more appropriate starting point for a longer-lived free PostgreSQL demo, provided you remain within its quotas. Neither service should be treated as a substitute for a production backup and recovery plan.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://render.com\&sz=32)

Render Docs+2



## 10. Final deployment checklist

Vue site deploys successfully on GitHub Pages

Neon PostgreSQL database is created and accessible from the backend

Spring Boot API deploys successfully on Render

API health endpoint returns HTTP 200

Vue can call the API without CORS errors

Secrets, authentication, HTTPS, and database protections are configured

0 of 6 completed

My recommendation: Start with this architecture for your first full-stack application. Once the app is working, add Spring Security, JWT-based authentication if needed, Flyway migrations, and automated tests before considering any production use.