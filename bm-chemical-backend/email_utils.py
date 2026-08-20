import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP Configuration (set these in Vercel Environment Variables)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")           # e.g. yourapp@gmail.com
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")   # Gmail App Password (NOT your normal password)
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://bm-chemical-frontend.vercel.app")


def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """
    Sends a password reset email with a link containing the reset token.
    Returns True if sent successfully, False otherwise.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP credentials not configured. Skipping email send.")
        return False

    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    subject = "BM Chemicals - Password Reset Request"
    body = f"""
Hello,

We received a request to reset your BM Chemicals account password.

Click the link below to set a new password (valid for 30 minutes):

{reset_link}

If you did not request this, you can safely ignore this email.

- BM Chemicals Team
"""

    msg = MIMEMultipart()
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"Failed to send reset email: {e}")
        return False