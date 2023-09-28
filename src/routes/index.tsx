import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";

import AppRouter from "./app.routes";
import AuthRoutes from "./auth.routes";
import { AuthContext } from "../contexts/AuthContext";

export default function Routes() {
    const { isAuthenticated } = useContext(AuthContext);
    const {loading} = useContext(AuthContext);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#1d1d2e",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <ActivityIndicator size={60} color="#fff" />
            </View>
        )
    }
    return (
        isAuthenticated ? <AppRouter /> : <AuthRoutes />
    )
}