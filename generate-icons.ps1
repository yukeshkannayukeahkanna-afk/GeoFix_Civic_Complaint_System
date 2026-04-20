# GeoFix Icon Generator - PowerShell Script
# Generates PWA icons using .NET Graphics

Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$OutputPath
    )
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Create gradient brush
    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $color1 = [System.Drawing.Color]::FromArgb(37, 99, 235)  # #2563eb
    $color2 = [System.Drawing.Color]::FromArgb(29, 78, 216)  # #1d4ed8
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, 45)
    
    # Fill background with gradient
    $graphics.FillRectangle($brush, $rect)
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", ($Size * 0.3), [System.Drawing.FontStyle]::Bold)
    $textBrush = [System.Drawing.Brushes]::White
    $text = "GF"
    
    # Measure text to center it
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($Size - $textSize.Width) / 2
    $y = ($Size - $textSize.Height) / 2
    
    $graphics.DrawString($text, $font, $textBrush, $x, $y)
    
    # Add subtitle for larger icons
    if ($Size -ge 128) {
        $smallFont = New-Object System.Drawing.Font("Arial", ($Size * 0.12), [System.Drawing.FontStyle]::Regular)
        $subtitle = "GeoFix"
        $subtitleSize = $graphics.MeasureString($subtitle, $smallFont)
        $subX = ($Size - $subtitleSize.Width) / 2
        $subY = $Size * 0.72
        $graphics.DrawString($subtitle, $smallFont, $textBrush, $subX, $subY)
        $smallFont.Dispose()
    }
    
    # Save the image
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $font.Dispose()
    $brush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

function Create-Favicon {
    param(
        [string]$OutputPath
    )
    
    # Create a simple 32x32 favicon
    $size = 32
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Create gradient background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $color1 = [System.Drawing.Color]::FromArgb(37, 99, 235)
    $color2 = [System.Drawing.Color]::FromArgb(29, 78, 216)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, 45)
    
    $graphics.FillRectangle($brush, $rect)
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
    $textBrush = [System.Drawing.Brushes]::White
    $text = "G"
    
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($size - $textSize.Width) / 2
    $y = ($size - $textSize.Height) / 2
    
    $graphics.DrawString($text, $font, $textBrush, $x, $y)
    
    # Save as PNG first, then ICO
    $pngPath = $OutputPath -replace '\.ico$', '.png'
    $bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # For ICO, we'll just copy the PNG (browsers accept PNG as favicon)
    Copy-Item $pngPath $OutputPath -Force
    
    # Cleanup
    $font.Dispose()
    $brush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Main execution
Write-Host "🔧 GeoFix Icon Generator" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$iconsDir = Join-Path $scriptDir "icons"

# Create icons directory if it doesn't exist
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
}

# Define icon sizes
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Generating $($sizes.Count) PWA icons...`n" -ForegroundColor Yellow

foreach ($size in $sizes) {
    $filename = "icon-$($size)x$size.png"
    $filepath = Join-Path $iconsDir $filename
    
    Write-Host "Creating $filename... " -NoNewline
    
    try {
        Create-Icon -Size $size -OutputPath $filepath
        Write-Host "✅" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
}

# Generate favicon.ico
Write-Host "`nGenerating favicon.ico... " -NoNewline
try {
    $faviconPath = Join-Path $scriptDir "favicon.ico"
    Create-Favicon -OutputPath $faviconPath
    Write-Host "✅" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host "`n" + ("=" * 50)
Write-Host "✅ Icon generation complete!" -ForegroundColor Green
Write-Host "📁 Icons saved to: $iconsDir" -ForegroundColor Cyan
Write-Host "📁 Favicon saved to: $scriptDir" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Reload your app in the browser (Ctrl+F5)" -ForegroundColor White
Write-Host "2. The PWA icon errors should be resolved" -ForegroundColor White
Write-Host "3. (Optional) Replace with custom icons later" -ForegroundColor White
