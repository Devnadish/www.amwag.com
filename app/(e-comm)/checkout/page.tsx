// pages/checkout.tsx
"use client";
import { useState, useEffect } from "react";
import AddressSelection from "./components/AddressSelection";
import OtpVerification from "./components/OtpVerification";
import TermsDialog from "./components/TermsDialog";
import UserForm from "./components/UserForm";
import MapDisplay from "./components/MapDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocated } from "react-geolocated";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const CartSummary = dynamic(() => import("../cart/component/CartSummary"), {
  ssr: false,
});

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
  });
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  useEffect(() => {
    setIsClient(true);
    if (isLogin) {
      setSavedAddress("123 شارع الملك فهد، الرياض، السعودية");
      setSelectedAddress("123 شارع الملك فهد، الرياض، السعودية");
      setUserName("أحمد");
    }
  }, [isLogin]);

  useEffect(() => {
    if (isClient && !isLogin && coords) {
      setCoordinates({ lat: coords.latitude, lng: coords.longitude });
      setSelectedAddress(
        `خط العرض: ${coords.latitude}, خط الطول: ${coords.longitude}`
      );
    }
  }, [isClient, coords, isLogin]);

  const handleSelectAddress = (address: string) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("يرجى اختيار عنوان التوصيل قبل المتابعة.");
      return;
    }
    if (!isLogin && (!userName || !userPhone)) {
      alert("يرجى إدخال الاسم ورقم الهاتف للمتابعة.");
      return;
    }
    if (!isLogin && !otpVerified) {
      setShowOtpDialog(true);
      return;
    }
    alert(`تم تأكيد الطلب! العنوان المختار: ${selectedAddress}`);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md lg:max-w-3xl shadow-lg rounded-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-foreground">
            تأكيد الطلب
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pb-20">
          {!isLogin && (
            <UserForm
              userName={userName}
              setUserName={setUserName}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              setIsLogin={setIsLogin}
            />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CartSummary />
            <div>
              <Label className="font-medium text-foreground">
                عنوان التوصيل:
              </Label>
              <div className="p-4 bg-muted border rounded-lg mb-4">
                <p className="text-muted-foreground">
                  {selectedAddress || "لم يتم تحديد عنوان بعد"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowAddressDialog(true)}
                  className="mt-2 w-full"
                >
                  اختيار عنوان مختلف
                </Button>
              </div>
              <MapDisplay coordinates={coordinates} />
            </div>
          </div>
          {!isLogin && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  أوافق على{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsDialog(true);
                    }}
                    className="text-primary underline"
                  >
                    الشروط والأحكام
                  </a>{" "}
                  وسياسة الخصوصية.
                </Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="fixed bottom-0 left-0 w-full bg-background p-5 shadow-md flex flex-col items-center border-t border-border">
        <Button
          onClick={handleCheckout}
          disabled={!isLogin && !agreeToTerms}
          className="w-full max-w-md lg:max-w-3xl py-3 font-medium text-lg"
        >
          المتابعة إلى الدفع
        </Button>
      </div>
      <AddressSelection
        showAddressDialog={showAddressDialog}
        setShowAddressDialog={setShowAddressDialog}
        savedAddress={savedAddress}
        coordinates={coordinates}
        handleSelectAddress={handleSelectAddress}
      />
      <OtpVerification
        showOtpDialog={showOtpDialog}
        setShowOtpDialog={setShowOtpDialog}
        otp={otp}
        setOtp={setOtp}
        handleVerifyOtp={() => setOtpVerified(true)}
      />
      <TermsDialog
        showTermsDialog={showTermsDialog}
        setShowTermsDialog={setShowTermsDialog}
      />
    </div>
  );
}
