import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [data, setData] = React.useState({
		username: "",
		email: "",
		password: "",
		repeat_password: "",
	});
	const router = useRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// username email
		console.log(data);
		await fetch(`${process.env.API_PATH}/auth/register`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					return router.push("/login");
				} else {
					return enqueueSnackbar(res.message, { variant: "error" });
				}
			});
	}
	return (
		<div className="h-screen w-screen flex justify-center items-center bg-black text-white">
			<form onSubmit={handleSubmit}>
				<h1 className="h1 py-2 px-1 font-bold text-center">Register Page</h1>
				<div className="p-2">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						id="username"
						className="ms-1 bg-slate-700"
						onChange={(e) => setData({ ...data, username: e.target.value })}
					/>
				</div>
				<div className="p-2">
					<label htmlFor="email">Email</label>
					<input type="email" name="email" id="email" className="ms-1 bg-slate-700" onChange={(e) => setData({ ...data, email: e.target.value })} />
				</div>
				<div className="p-2">
					<label htmlFor="password">Password</label>
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						id="password"
						className="ms-1 bg-slate-700"
						onChange={(e) => setData({ ...data, password: e.target.value })}
					/>
					<button className="ms-1" type="button" onClick={() => setShowPassword((prev) => (prev ? false : true))}>
						{showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
					</button>
				</div>
				<div className="p-2">
					<label htmlFor="repeat_password">Confirm Password</label>
					<input
						type={showPassword ? "text" : "password"}
						name="repeat_password"
						id="repeat_password"
						className="ms-1 bg-slate-700"
						onChange={(e) => setData({ ...data, repeat_password: e.target.value })}
					/>
					<button className="ms-1" type="button" onClick={() => setShowPassword((prev) => (prev ? false : true))}>
						{showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
					</button>
				</div>
				<div className="p-2 text-center">
					<button type="submit" className="py-1 px-2 rounded bg-gray-700">
						Register
					</button>
				</div>
			</form>
		</div>
	);
}
