# Portfolio

Ce dépôt contient le code source pour mon portfolio accessible [ici](https://portfolio.jfrancart.fr)

## Build

L'utilisation recommandée utilise une image Docker.
Pour la construire, il faut déjà renseigner les variables d'environnement, un fichier .env peut être utilisé
Example : 
```
PORTFOLIO_FILES_DIRECTORY=./.files
PORTFOLIO_MAIL_HREF="mailto:example@domain.com"
```

Puis pour lancer l'application : 
`docker compose up -d`

L'application expose le port 8080 par défaut, il est possible d'y attacher un proxy inversé ou bien de changer ce paramètre si nécessaire.

Pour stopper l'application :
`docker compose down`

Pour un développement en local, il est aussi possible de build l'application sans Docker, pour ce faire, il faut déjà télécharger et installer le [SDK .NET 8.0](https://dotnet.microsoft.com/fr-fr/download/dotnet/8.0)
Ensuite, il faut renseigner la variable d'environnement 'PORTFOLIO_MAIL_HREF' dans le fichier Properties/launchSettings.json.
Enfin, il faut modifier le fichier Program.cs pour servir les fichiers statiques d'un dossier en local :
```csharp
    //FileProvider = new PhysicalFileProvider("/Files/")
    
    // Non docker testing
    FileProvider = new PhysicalFileProvider("path/to/files/folder")
```

Nous pouvons maintenant build l'application et la lancer :
```
cd Portfolio
dotnet build
dotnet run
```