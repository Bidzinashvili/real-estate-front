export const AUTH_COPY = {
  signInTitle: "ანგარიშში შესვლა",
  signInDescription: "შედით ელფოსტით და პაროლით ან Google-ით",
  emailLabel: "ელფოსტა",
  passwordLabel: "პაროლი",
  currentPasswordLabel: "მიმდინარე პაროლი",
  newPasswordLabel: "ახალი პაროლი",
  confirmPasswordLabel: "გაიმეორეთ პაროლი",
  confirmNewPasswordLabel: "გაიმეორეთ ახალი პაროლი",
  signInButton: "შესვლა",
  signingIn: "შესვლა მიმდინარეობს...",
  forgotPasswordLink: "დაგავიწყდა პაროლი?",
  invalidCredentials: "ელფოსტა ან პაროლი არასწორია",
  emailRequired: "შეიყვანეთ ელფოსტა",
  passwordRequired: "შეიყვანეთ პაროლი",
  orDivider: "ან",
  rateLimited: "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ.",
  genericError: "რაღაც შეცდომა მოხდა. გთხოვთ, სცადოთ თავიდან.",
  sessionExpired: "სესია დასრულდა. გთხოვთ, თავიდან შეხვიდეთ ანგარიშში.",
  passwordChangedLogout: "პაროლი შეიცვალა. გთხოვთ, თავიდან შეხვიდეთ ანგარიშში.",
  passwordResetSuccess: "პაროლი წარმატებით შეიცვალა",
  passwordSetSuccess: "პაროლი წარმატებით დაყენდა",
  forgotPasswordTitle: "პაროლის აღდგენა",
  forgotPasswordDescription: "შეიყვანეთ ელფოსტა. თუ ანგარიში არსებობს, აღდგენის ბმული გამოგიგზავნით.",
  forgotPasswordSubmit: "პაროლის აღდგენა",
  forgotPasswordSuccess:
    "თუ ამ ელფოსტით ანგარიში არსებობს, პაროლის აღდგენის ბმული გამოგზავნილია.",
  resetPasswordTitle: "პაროლის შეცვლა",
  resetPasswordSubmit: "პაროლის შეცვლა",
  setPasswordTitle: "პაროლის დაყენება",
  setPasswordSubmit: "პაროლის დაყენება",
  submitting: "მუშავდება…",
  backToSignIn: "შესვლა",
  passwordPolicyHelper: "მინიმუმ 8 სიმბოლო, ერთი დიდი ასო, ერთი პატარა ასო და ერთი ციფრი.",
  passwordTooLong: "პაროლი არ უნდა აღემატებოდეს 128 სიმბოლოს.",
  passwordsDoNotMatch: "პაროლები არ ემთხვევა",
  showPassword: "პაროლის ჩვენება",
  hidePassword: "პაროლის დამალვა",
  invalidResetToken: "პაროლის აღდგენის ბმული არასწორია.",
  expiredResetToken: "პაროლის აღდგენის ბმულს ვადა გაუვიდა. თავიდან მოითხოვეთ პაროლის აღდგენა.",
  usedResetToken: "ეს ბმული უკვე გამოყენებულია.",
  invalidSetupToken: "პაროლის დაყენების ბმული არასწორია.",
  expiredSetupToken:
    "პაროლის დაყენების ბმულს ვადა გაუვიდა. დაუკავშირდით ადმინისტრატორს ახალი ბმულის მისაღებად.",
  usedSetupToken: "ეს ბმული უკვე გამოყენებულია.",
  missingToken: "ბმული არასრულია. გთხოვთ, გამოიყენოთ ელფოსტაში გამოგზავნილი ბმული.",
  changePasswordTitle: "პაროლის შეცვლა",
  securitySectionTitle: "უსაფრთხოება",
  accountPageTitle: "ანგარიში",
  passwordNotSet: "ამ ანგარიშისთვის პაროლი ჯერ არ არის დაყენებული.",
  wrongCurrentPassword: "მიმდინარე პაროლი არასწორია",
  sameAsCurrentPassword: "ახალი პაროლი მიმდინარე პაროლისგან განსხვავებული უნდა იყოს.",
  passwordSetBadge: "პაროლი დაყენებულია",
  passwordPendingBadge: "პაროლის დაყენებას ელოდება",
  agentCreated: "მომხმარებელი შეიქმნა.",
  agentCreatedEmailSent: "მომხმარებელი შეიქმნა და პაროლის დაყენების ბმული გაეგზავნა ელფოსტაზე.",
  agentCreatedEmailFailed: "მომხმარებელი შეიქმნა, მაგრამ პაროლის დაყენების წერილი ვერ გაიგზავნა.",
  resendSetup: "ბმულის ხელახლა გაგზავნა",
  resendSetupSuccess: "პაროლის დაყენების ბმული ხელახლა გაიგზავნა.",
  adminResetPassword: "პაროლის შეცვლა",
  adminResetWarning:
    "პაროლის შეცვლის შემდეგ მომხმარებელი ყველა მოწყობილობაზე გამოვა ანგარიშიდან და თავიდან მოუწევს შესვლა.",
  adminResetSuccess: "პაროლი შეიცვალა. მომხმარებელი ყველა აქტიური სესიიდან გამოვიდა.",
  adminResetForbidden: "ამ მოქმედების შესრულება არ გაქვთ უფლება.",
  adminResetNotFound: "აგენტი ვერ მოიძებნა.",
  goToAgents: "აგენტების სიაზე დაბრუნება",
} as const;

export type SignInNoticeReason =
  | "session-expired"
  | "password-changed"
  | "password-reset"
  | "password-set";

export function getSignInNotice(reason: string | null | undefined): string | null {
  if (reason === "session-expired") {
    return AUTH_COPY.sessionExpired;
  }
  if (reason === "password-changed") {
    return AUTH_COPY.passwordChangedLogout;
  }
  if (reason === "password-reset") {
    return AUTH_COPY.passwordResetSuccess;
  }
  if (reason === "password-set") {
    return AUTH_COPY.passwordSetSuccess;
  }
  return null;
}
