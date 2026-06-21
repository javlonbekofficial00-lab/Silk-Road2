# PowerShell REST API & Static File Web Server
# Serves the frontend portfolio and handles backend logic natively.

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3000/")

$dbFile = Join-Path $PSScriptRoot "data.json"
$publicDir = Join-Path $PSScriptRoot "public"

# Ensure database exists
if (-not (Test-Path $dbFile)) {
    @{
        messages = @()
        views = 0
        interactions = 0
    } | ConvertTo-Json -Depth 10 | Out-File $dbFile -Encoding utf8
}

# MIME Types mapping
function Get-ContentType ($extension) {
    switch ($extension) {
        ".html" { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "application/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".gif"  { return "image/gif" }
        ".svg"  { return "image/svg+xml" }
        ".ico"  { return "image/x-icon" }
        default { return "application/octet-stream" }
    }
}

# Bot response logic
function Get-BotResponse ($userMessage) {
    $msg = $userMessage.ToLower().Trim()
    
    # Pre-defined responses mapping
    if ($msg -match "hello|hi|hey|greetings|morning|evening") {
        return "Hi there! I am the Portfolio Assistant. I'm here to answer questions about my skills, projects, and career path. Feel free to ask anything!"
    }
    
    if ($msg -match "who are you|about yourself|tell me about|your name|introduce") {
        return "I am a Full-Stack Software Engineer dedicated to crafting beautiful, high-performance web applications. I love solving complex backend problems, creating sleek user interfaces, and designing robust system architectures. Ask me about my 'skills' or 'projects' to learn more!"
    }
    
    if ($msg -match "skills|tech stack|technologies|languages|what do you use|frameworks|database") {
        return "Here is my current tech stack:<br><br>&bull; <b>Frontend:</b> JavaScript (ES6+), HTML5, CSS3, React, Next.js, Canvas API<br>&bull; <b>Backend:</b> Node.js (Express), Python (Flask/FastAPI), PowerShell scripting<br>&bull; <b>Databases & Cloud:</b> PostgreSQL, SQLite, MongoDB, Firebase, AWS<br>&bull; <b>Tools & Workflows:</b> Git, Docker, CI/CD, Agile methodology<br><br>I'm always eager to learn and adapt to new technologies depending on project needs."
    }
    
    if ($msg -match "projects|portfolio|what have you built|work|examples|apps") {
        return "I've built several notable projects, which you can see highlighted in the Projects section. Here are three key ones:<br><br>1. <b>DevSpace Analytics:</b> A modern real-time tracking application featuring deep telemetry insights.<br>2. <b>Nebula Chat:</b> An AI-integrated communication platform using WebSockets.<br>3. <b>RetroSynth Canvas:</b> An interactive visual generator powered by web audio and canvas APIs.<br><br>Would you like to know about a specific one? Or check the 'Recruiter Recommendation' filter on the page to highlight relevant projects!"
    }
    
    if ($msg -match "contact|hire|email|phone|reach|availab|job|work with you") {
        return "I am currently open to exciting full-time roles and freelance collaborations! You can reach out directly using the <b>Contact Form</b> below, or email me at <b>developer@example.com</b>. I usually reply within 24 hours."
    }

    if ($msg -match "education|degree|university|study|college|learn") {
        return "I hold a Bachelor's Degree in Computer Science and Engineering. Beyond academic studies, I am a self-driven developer who stays current by building real-world projects, contributing to open-source, and reading technical engineering articles."
    }

    if ($msg -match "experience|history|background|past job|career|company") {
        return "I've worked as a Software Engineer delivering robust solutions. My history includes designing REST APIs, optimization of database queries, and leading frontend overhauls. Check out the <b>Timeline</b> section on this page to view my career trajectory!"
    }
    
    # Default fallback
    return "I appreciate your message! I can help you learn more about my background. Try asking me about my <b>'skills'</b>, <b>'projects'</b>, <b>'experience'</b>, or how to <b>'contact'</b> me."
}

# Start server
$listener.Start()
Write-Host "--------------------------------------------------------" -ForegroundColor Green
Write-Host "  Developer Portfolio Server Running Successfully!" -ForegroundColor Green
Write-Host "  Address: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Green

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        $method = $request.HttpMethod
        
        # Log request
        Write-Host "[(Get-Date -Format 'HH:mm:ss')] $method $url" -ForegroundColor Gray
        
        # Normalize index route
        if ($url -eq "/" -or $url -eq "") {
            $url = "/index.html"
        }
        
        # Enable CORS for convenience
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
        
        # Handle Preflight OPTIONS request
        if ($method -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }
        
        # REST API Routes
        
        # GET /api/analytics
        if ($url -eq "/api/analytics" -and $method -eq "GET") {
            if (Test-Path $dbFile) {
                $data = Get-Content $dbFile -Raw | ConvertFrom-Json
                $payload = @{
                    views = $data.views
                    interactions = $data.interactions
                    messages_count = $data.messages.Count
                } | ConvertTo-Json
            } else {
                $payload = @{ views = 0; interactions = 0; messages_count = 0 } | ConvertTo-Json
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($payload)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }
        
        # POST /api/analytics/view
        if ($url -eq "/api/analytics/view" -and $method -eq "POST") {
            $viewsCount = 1
            if (Test-Path $dbFile) {
                $data = Get-Content $dbFile -Raw | ConvertFrom-Json
                $data.views += 1
                $viewsCount = $data.views
                $data | ConvertTo-Json -Depth 10 | Out-File $dbFile -Encoding utf8
            }
            
            $payload = @{ success = $true; views = $viewsCount } | ConvertTo-Json
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($payload)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }
        
        # POST /api/contact
        if ($url -eq "/api/contact" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $body = $reader.ReadToEnd()
            
            try {
                $contact = $body | ConvertFrom-Json
                
                if ([string]::IsNullOrWhiteSpace($contact.name) -or [string]::IsNullOrWhiteSpace($contact.email) -or [string]::IsNullOrWhiteSpace($contact.message)) {
                    throw "Required fields missing."
                }
                
                $data = Get-Content $dbFile -Raw | ConvertFrom-Json
                $newMessage = @{
                    id = [Guid]::NewGuid().ToString()
                    name = $contact.name
                    email = $contact.email
                    message = $contact.message
                    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }
                $data.messages += $newMessage
                $data.interactions += 1
                $data | ConvertTo-Json -Depth 10 | Out-File $dbFile -Encoding utf8
                
                $payload = @{ success = $true; message = "Thank you! Your message was received successfully." } | ConvertTo-Json
                $response.StatusCode = 200
            } catch {
                $payload = @{ success = $false; error = "Invalid data format or missing required fields." } | ConvertTo-Json
                $response.StatusCode = 400
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($payload)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }
        
        # POST /api/chat
        if ($url -eq "/api/chat" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $body = $reader.ReadToEnd()
            
            try {
                $chatReq = $body | ConvertFrom-Json
                $reply = Get-BotResponse $chatReq.message
                
                # Increment interactions in DB
                if (Test-Path $dbFile) {
                    $data = Get-Content $dbFile -Raw | ConvertFrom-Json
                    $data.interactions += 1
                    $data | ConvertTo-Json -Depth 10 | Out-File $dbFile -Encoding utf8
                }
                
                $payload = @{ success = $true; reply = $reply } | ConvertTo-Json
                $response.StatusCode = 200
            } catch {
                $payload = @{ success = $false; error = "Could not parse request." } | ConvertTo-Json
                $response.StatusCode = 400
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($payload)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }
        
        # Serve static file
        $filePath = Join-Path $publicDir $url.Replace('/', '\')
        
        # Security check: Ensure file path remains within the public directory
        if ($filePath.StartsWith($publicDir) -and (Test-Path $filePath -PathType Leaf)) {
            $buffer = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath)
            
            $response.ContentType = Get-ContentType $ext
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
            $response.ContentType = "text/plain"
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server error occurred: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Red
}
