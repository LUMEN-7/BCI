import { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

import './style.css';

export default function FloatingInput({
	label,
	value,
	onChange,
	type = 'text',
	error,
}) {
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = type === 'password';
	const hasValue = value?.length > 0;

	return (
		<div className="input-wrapper">
			<div
				className={`
					input-container
					${hasValue ? 'input-focused' : ''}
					${error ? 'input-error-border' : ''}
				`}
			>
				<label
					className={`
						label
						${error ? 'label-error' : ''}
					`}
				>
					{label}
				</label>

				<input
					className={`
						input
						${isPassword ? 'password-input' : ''}
					`}
					type={
						isPassword && !showPassword
							? 'password'
							: 'text'
					}
					value={value}
					onChange={(event) =>
						onChange(event.target.value)
					}
				/>

				{isPassword && (
					<button
						type="button"
						className="eye-button"
						onClick={() =>
							setShowPassword(!showPassword)
						}
					>
						{showPassword ? (
							<IoEyeOffOutline />
						) : (
							<IoEyeOutline />
						)}
					</button>
				)}
			</div>

			<p className="input-error">{error || ' '}</p>
		</div>
	);
}