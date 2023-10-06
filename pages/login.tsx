import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
	const [showPassword, setShowPassword] = React.useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		await fetch(`${process.env.API_PATH}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
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
	}
	return (
		<div className="h-screen w-screen flex justify-center items-center bg-black text-white">
			<form onSubmit={handleSubmit}>
				<h1 className="h1 py-2 px-1 font-bold text-center">Login Page</h1>
				<div className="p-2">
					<label htmlFor="emailOrUsername">Email or Username</label>
					<input type="text" name="emailOrUsername" id="emailOrUsername" className="ms-1 bg-slate-700" />
				</div>
				<div className="p-2">
					<label htmlFor="password">Password</label>
					<input type={showPassword ? "text" : "password"} name="password" id="password" className="ms-1 bg-slate-700" />
					<button className="ms-1" type="button" onClick={() => setShowPassword((prev) => (prev ? false : true))}>
						{showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
					</button>
				</div>
				<div className="p-2">
					<button type="submit" className="py-1 px-2 rounded bg-gray-700">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
