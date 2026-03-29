$path = 'src/pages/Register.tsx'
$content = Get-Content -Raw -Encoding utf8 $path
$old = "pattern=\"(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\[\\]{}\\-_=+\\|;:'\",.<>/?]).{8,}\""
$new = "pattern={`(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\[\\]{}\\-_=+\\|;:'\",.<>/?]).{8,}`}"
$pattern = [regex]::Escape($old)
$content = [regex]::Replace($content, $pattern, $new)
Set-Content -Encoding utf8 -Path $path $content
