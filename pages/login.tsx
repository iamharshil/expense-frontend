import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
	const [loginData, setLoginData] = useState({
		emailOrUsername: "",
		password: "",
	});
	const [showPassword, setShowPassword] = React.useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();

	async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setLoginData((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		await fetch(`${process.env.API_PATH}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(loginData),
		})
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				if (response.success) {
					enqueueSnackbar(response.message, { variant: "success" });
					return router.push("/");
				} else {
					return enqueueSnackbar(response.message, { variant: "error" });
				}
			})
			.catch((err) => console.error(err));
	}
	return (
		<div className="h-screen w-screen flex justify-center items-center bg-gray-900 text-white">
			<div
				className="absolute inset-0 bg-cover bg-center z-0"
				style={{
					backgroundImage:
						"url('https://img.freepik.com/free-photo/beautiful-nature-landscape-with-mountains-lake_23-2150705872.jpg?t=st=1696747532~exp=1696751132~hmac=d049e532cfb304a7a0cfa3d1dcfb434eb01a972d2c1c4a0045003bcfe1961460&w=1060')",
				}}
			/>
			<form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 z-10 w-1/4">
				<h1 className="text-3xl font-bold text-center mb-4">Login Page</h1>
				<div className="mb-4">
					<label htmlFor="emailOrUsername" className="block font-medium mb-2">
						Email or Username
					</label>
					<input
						type="text"
						name="emailOrUsername"
						id="emailOrUsername"
						className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
						onChange={handleInputChange}
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="password" className="block font-medium mb-2">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							id="password"
							className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
							onChange={handleInputChange}
						/>
						<button
							className="absolute top-1/2 right-2 transform -translate-y-1/2"
							type="button"
							onClick={() => setShowPassword((prev) => (prev ? false : true))}
						>
							{showPassword ? <AiFillEye className="text-gray-400" /> : <AiFillEyeInvisible className="text-gray-400" />}
						</button>
					</div>
				</div>
				<div className="mb-4">
					<button type="submit" className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
