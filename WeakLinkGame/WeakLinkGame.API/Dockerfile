FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
ENV ASPNETCORE_URLS=http://+:7089
WORKDIR /app
EXPOSE 7089

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["WeakLinkGame.API/WeakLinkGame.API.csproj", "WeakLinkGame.API/"]
COPY ["Utils/Utils.csproj", "Utils/"]
COPY ["WeakLinkGame.DataAccessLayer/WeakLinkGame.DataAccessLayer.csproj", "WeakLinkGame.DataAccessLayer/"]
COPY ["WeakLinkGame.DataContracts/WeakLinkGame.DataContracts.csproj", "WeakLinkGame.DataContracts/"]
RUN dotnet restore "WeakLinkGame.API/WeakLinkGame.API.csproj"
COPY . .
WORKDIR "/src/WeakLinkGame.API"
RUN dotnet build "WeakLinkGame.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeakLinkGame.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeakLinkGame.API.dll"]
