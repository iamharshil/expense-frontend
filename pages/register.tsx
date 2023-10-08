import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function RegisterPage() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [showPassword, setShowPassword] = React.useState([false, false]);
	const [data, setData] = React.useState({
		username: "",
		email: "",
		password: "",
		repeat_password: "",
	});
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		await fetch(`${process.env.API_PATH}/auth/register`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((response) => {
				if (response.success) {
					enqueueSnackbar(response.message, { variant: "success" });
					return router.push("/login");
				} else {
					enqueueSnackbar(response.message, { variant: "error" });
					return false;
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
				<h1 className="text-3xl font-bold text-center mb-5">Register Page</h1>
				<div className="mb-4">
					<label htmlFor="username" className="block text-gray-300 font-bold mb-1">
						Username
					</label>
					<input
						type="text"
						name="username"
						id="username"
						className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
						onChange={(e) => setData({ ...data, username: e.target.value })}
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block text-gray-300 font-bold mb-1">
						Email
					</label>
					<input
						type="email"
						name="email"
						id="email"
						className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
						onChange={(e) => setData({ ...data, email: e.target.value })}
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="password" className="block text-gray-300 font-bold mb-1">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword[0] ? "text" : "password"}
							name="password"
							id="password"
							className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white pr-10"
							onChange={(e) => setData({ ...data, password: e.target.value })}
						/>
						<button
							className="absolute top-1/2 right-2 transform -translate-y-1/2"
							type="button"
							onClick={() => setShowPassword((prev) => [prev[0] ? false : true, prev[1]])}
						>
							{showPassword[0] ? <AiFillEye /> : <AiFillEyeInvisible />}
						</button>
					</div>
				</div>
				<div className="mb-4">
					<label htmlFor="repeat_password" className="block text-gray-300 font-bold mb-1">
						Confirm Password
					</label>
					<div className="relative">
						<input
							type={showPassword[1] ? "text" : "password"}
							name="repeat_password"
							id="repeat_password"
							className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white pr-10"
							onChange={(e) => setData({ ...data, repeat_password: e.target.value })}
						/>
						<button
							className="absolute top-1/2 right-2 transform -translate-y-1/2"
							type="button"
							onClick={() => setShowPassword((prev) => [prev[0], prev[1] ? false : true])}
						>
							{showPassword[1] ? <AiFillEye /> : <AiFillEyeInvisible />}
						</button>
					</div>
				</div>
				<div className="text-center">
					<button type="submit" className="py-2 px-4 rounded-lg bg-gray-700 text-white font-bold hover:bg-gray-600">
						Register
					</button>
				</div>
			</form>
		</div>
	);
}
