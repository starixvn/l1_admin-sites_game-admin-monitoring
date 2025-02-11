FROM hub.lumigame.com/base/dotnet/core/sdk:3.1-5-6 AS builder
WORKDIR /src

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

COPY ./src/game-admin-client ./game-admin-client
COPY ./src/GamesAdminMonitoring.Site/GamesAdminMonitoring.Site.csproj ./GamesAdminMonitoring.Site/GamesAdminMonitoring.Site.csproj

WORKDIR /src/GamesAdminMonitoring.Site
RUN dotnet restore -v diag

COPY ./src/GamesAdminMonitoring.Site .
RUN node -v
RUN npm run export --prefix ../game-admin-client

RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM hub.lumigame.com/base/dotnet/core/aspnet:3.1.32-alpine AS base
RUN apk update && apk upgrade && apk add --no-cache curl
RUN adduser admin_monitoring_user --disabled-password
USER admin_monitoring_user 

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "GamesAdminMonitoring.Site.dll"]