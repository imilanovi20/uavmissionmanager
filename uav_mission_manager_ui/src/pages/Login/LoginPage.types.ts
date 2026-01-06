export interface LoginPageProps {
  onLogin?: (credentials: { username: string; password: string }) => void;
}

export interface LoginFormData {
  username: string;
  password: string;
}