# PowerShell script to replace blue colors with teal/coral/amber theme
$files = @(
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\Vessels.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\Ports.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\Voyages.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\Events.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\Notifications.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\Profile.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\pages\ProfileEdit.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\components\VesselSearchFilter.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\components\VesselDetailsPanel.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\components\SubscriptionModal.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\components\SidebarPanel.jsx",
    "c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\client\src\components\RoleBasedUI.jsx"
)

# Color replacements
$replacements = @{
    'bg-blue-600' = 'bg-teal-600'
    'bg-blue-500' = 'bg-teal-500'
    'bg-blue-100' = 'bg-teal-100'
    'bg-blue-50' = 'bg-teal-50'
    'text-blue-700' = 'text-teal-700'
    'text-blue-600' = 'text-teal-600'
    'text-blue-800' = 'text-teal-800'
    'hover:bg-blue-700' = 'hover:bg-teal-700'
    'hover:bg-blue-100' = 'hover:bg-teal-100'
    'hover:bg-blue-200' = 'hover:bg-teal-200'
    'border-blue-600' = 'border-teal-600'
    'border-blue-200' = 'border-teal-200'
}

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        foreach ($key in $replacements.Keys) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
        }
        Set-Content $file -Value $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "Color replacement complete!"
