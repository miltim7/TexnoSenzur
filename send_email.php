<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

$name = htmlspecialchars(trim($input['name'] ?? ''));
$phone = htmlspecialchars(trim($input['phone'] ?? ''));
$email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(trim($input['message'] ?? ''));

$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Ad minimum 2 simvol olmalıdır';
}

if (empty($phone)) {
    $errors[] = 'Telefon nömrəsi tələb olunur';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Düzgün email daxil edin';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Mesaj minimum 10 simvol olmalıdır';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$to = 'ziya.nazarov@texnosenzur.az';
$subject = 'Yeni müraciət: ' . $name;
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c99a18; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #c99a18; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Yeni Müraciət - Texnosenzur</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Ad Soyad:</div>
                <div>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Telefon:</div>
                <div>$phone</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div>$email</div>
            </div>
            <div class='field'>
                <div class='label'>Mesaj:</div>
                <div>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Bu mesaj texnosenzur.az saytından göndərilib</p>
            <p>Tarix: " . date('d.m.Y H:i') . "</p>
        </div>
    </div>
</body>
</html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: noreply@texnosenzur.az',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

$success = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($success) {
    echo json_encode([
        'success' => true, 
        'message' => 'Mesajınız uğurla göndərildi!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Email göndərilmədi. Yenidən cəhd edin.'
    ]);
}
?>