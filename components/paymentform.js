import React, { useState } from "react";
import { FaSpinner, FaCreditCard, FaPaypal } from "react-icons/fa";

const PaymentForm = ({ onSuccess, onCancel, amount }) => {
    const [formData, setFormData] = useState({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        billingAddress: "",
        paymentMethod: "credit-card"
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.cardholderName) {
            newErrors.cardholderName = "Cardholder name is required";
        }

        const cardNumberStripped = formData.cardNumber.replace(/\s/g, "");
        if (!cardNumberStripped || cardNumberStripped.length !== 16) {
            newErrors.cardNumber = "Invalid card number";
        }

        const [month, year] = formData.expiryDate.split("/");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (!month || !year || parseInt(year) < currentYear ||
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            newErrors.expiryDate = "Invalid expiry date";
        }

        if (!formData.cvv || formData.cvv.length !== 3) {
            newErrors.cvv = "Invalid CVV";
        }

        if (!formData.billingAddress) {
            newErrors.billingAddress = "Billing address is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/.{4}/g);
        const match = matches && matches.join(" ");
        const parts = [];

        for (let i = 0, len = v.length; i < len; i += 4) {
            parts.push(v.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(" ");
        } else {
            return value;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cardNumber") {
            formattedValue = formatCardNumber(value);
        } else if (name === "expiryDate") {
            formattedValue = value
                .replace(/\D/g, "")
                .replace(/^([0-9]{2})/, "$1/")
                .slice(0, 5);
        } else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, "").slice(0, 3);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus({
                type: "success",
                message: "Payment processed successfully!"
            });

            setTimeout(() => {
                onSuccess()
            }, 1000);
        } catch (error) {
            setStatus({
                type: "error",
                message: "Payment processing failed. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="max-w-md md:w-full w-[90%] bg-gray-800 rounded-lg shadow-lg p-8 relative">
                <button
                    onClick={onCancel}
                    className="absolute top-2 right-3 hover:text-white text-gray-400 transition-colors duration-200"
                >
                    ✕
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold">Payment Details</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="flex sm:flex-row flex-col space-x-4 mb-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="credit-card"
                                    checked={formData.paymentMethod === "credit-card"}
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-indigo-600"
                                />
                                <span className="flex items-center">
                                    <FaCreditCard className="mr-2" />
                                    Credit Card
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={formData.paymentMethod === "paypal"}
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-indigo-600"
                                />
                                <span className="flex items-center">
                                    <FaPaypal className="mr-2" />
                                    PayPal
                                </span>
                            </label>
                        </div>

                        {formData.paymentMethod === "credit-card" && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="cardholderName" className="block text-sm font-medium">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="cardholderName"
                                        name="cardholderName"
                                        value={formData.cardholderName}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${errors.cardholderName ? "border-red-500" : "border-gray-300"} border  focus:border-indigo-500 focus:ring-indigo-500`}
                                        aria-label="Cardholder Name"
                                    />
                                    {errors.cardholderName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="cardNumber" className="block text-sm font-medium">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        maxLength="19"
                                        className={`mt-1 block w-full rounded-md shadow-sm ${errors.cardNumber ? "border-red-500" : "border-gray-300"} border focus:border-indigo-500 focus:ring-indigo-500`}
                                        aria-label="Card Number"
                                    />
                                    {errors.cardNumber && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-sm font-medium">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            className={`mt-1 block w-full rounded-md shadow-sm ${errors.expiryDate ? "border-red-500" : "border-gray-300"} border focus:border-indigo-500 focus:ring-indigo-500`}
                                            aria-label="Expiry Date"
                                        />
                                        {errors.expiryDate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="cvv" className="block text-sm font-medium">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            maxLength="3"
                                            className={`mt-1 block w-full rounded-md shadow-sm ${errors.cvv ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 border focus:ring-indigo-500`}
                                            aria-label="CVV"
                                        />
                                        {errors.cvv && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label htmlFor="billingAddress" className="block text-sm font-medium">
                                Billing Address
                            </label>
                            <textarea
                                id="billingAddress"
                                name="billingAddress"
                                value={formData.billingAddress}
                                onChange={handleInputChange}
                                rows="2"
                                className={`mt-1 block w-full rounded-md shadow-sm ${errors.billingAddress ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 border focus:ring-indigo-500`}
                                aria-label="Billing Address"
                            />
                            {errors.billingAddress && (
                                <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>
                            )}
                        </div>

                        {status.message && (
                            <div
                                className={`p-4 rounded-md ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                                role="alert"
                            >
                                {status.message}
                            </div>
                        )}
                        <div className="bg-gray-100 rounded-md mx-auto w-50 p-1 mb-3 text-center font-semibold text-gray-900">
                            Amount to Pay: ${amount}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Pay Now"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;