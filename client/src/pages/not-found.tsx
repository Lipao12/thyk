import { AlertCircle } from "lucide-react";
import Thinky from "../assets/thinky-error.png";
import { Card, CardContent } from "../components/ui/card";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation("not_found");
  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <Card className="w-full max-w-md mx-4 bg-gray-50">
        <CardContent className="pt-6">
          <img src={Thinky} alt="Thinky error" />
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t("not_found")}
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">{t("description")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
