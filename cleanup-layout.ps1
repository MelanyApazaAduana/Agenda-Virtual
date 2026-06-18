$layoutDir = "C:\Users\Jose\Desktop\Agenda\Agenda\Agenda_Virtual\frontend\src\components\layout"

# Step 1: Delete AppSidebar.vue
Remove-Item -Path "$layoutDir\AppSidebar.vue" -Force
Write-Output "Deleted AppSidebar.vue"

# Step 2: Delete .gitkeep
Remove-Item -Path "$layoutDir\.gitkeep" -Force
Write-Output "Deleted .gitkeep"

# Step 3: Delete the directory if empty
if (-not (Get-ChildItem -Path $layoutDir -ErrorAction SilentlyContinue)) {
  Remove-Item -Path $layoutDir -Force
  Write-Output "Deleted layout directory"
} else {
  Write-Output "Directory not empty, skipping deletion"
}
