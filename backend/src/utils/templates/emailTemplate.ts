export const resetPasswordTemplate = (resetUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;  max-width: 500px;">
      <h1 style="color: #4F46E5; margin-bottom: 0.5em;">Redefinição de Senha</h1>
      <p>Olá,</p>
      <p>Você solicitou uma redefinição de senha. Para prosseguir, clique no link abaixo:</p>
      <p style="text-align: center; margin: 1.5em 0;">
        <a
          href="${resetUrl}"
          style="
            background-color: #4F46E5;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
          "
        >
          Redefinir Senha
        </a>
      </p>
      <p style="font-size: 0.9em; color: #666666;">
        Se você não solicitou essa alteração, pode simplesmente ignorar este e‑mail.
      </p>
    </div>
  `;
};