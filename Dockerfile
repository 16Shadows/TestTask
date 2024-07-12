FROM node:20-slim as angular_build
WORKDIR /angular_app
COPY ./TestTaskFrontend .
RUN yarn global add @angular/cli --verbose
RUN yarn install --verbose
RUN ng build

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS aspnet_build
WORKDIR /aspnet_app
COPY ./TestTaskBackend/TestTaskBackend.csproj .
RUN dotnet restore TestTaskBackend.csproj
COPY ./TestTaskBackend .
RUN dotnet build "TestTaskBackend.csproj" -c Release -o /aspnet_app/build
RUN dotnet publish "TestTaskBackend.csproj" -c Release -o /aspnet_app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS deploy
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=aspnet_build /aspnet_app/publish .
COPY --from=angular_build /angular_app/dist/test-task-frontend/browser ./public

ENTRYPOINT ["dotnet", "TestTaskBackend.dll"]