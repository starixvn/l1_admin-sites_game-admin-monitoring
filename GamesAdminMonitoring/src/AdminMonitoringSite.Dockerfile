FROM registry.nexdev.net:5050/docker/dotnet/core/sdk:3.1 AS builder
WORKDIR /src

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

COPY ./GamesAdminMonitoring/src/game-admin-client ./game-admin-client
COPY ./GamesAdminMonitoring/src/GamesAdminMonitoring.Site/GamesAdminMonitoring.Site.csproj ./GamesAdminMonitoring.Site/GamesAdminMonitoring.Site.csproj

WORKDIR /src/GamesAdminMonitoring.Site
RUN dotnet restore -v diag

COPY ./GamesAdminMonitoring/src/GamesAdminMonitoring.Site .
RUN npm run export --prefix ../game-admin-client

RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM registry.nexdev.net:5050/docker/dotnet/core/aspnet:3.1-buster-slim AS base

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "GamesAdminMonitoring.Site.dll"]