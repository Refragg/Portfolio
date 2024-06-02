using Microsoft.Extensions.FileProviders;
using Portfolio.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStatusCodePagesWithRedirects("/Error?code={0}");

app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    RequestPath = "/files",
    FileProvider = new PhysicalFileProvider("/Files/")
    
    // Non docker testing
    //FileProvider = new PhysicalFileProvider("path/to/files/folder")
});
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
