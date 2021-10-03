const SurveyField = ({ input, label, meta }) => {
	const renderError = ({ error, touched }) => {
		// touched means u clicked on it and clicked out
		if (touched && error) {
			return (
				<div className='red-text' style={{ marginBottom: '20px' }}>
					{error}
				</div>
			);
		}
	};

	return (
		<div>
			<label>{label}</label>
			<input
				{...input}
				autoComplete='off'
				style={{ marginBottom: '5px' }}
			/>
			{renderError(meta)}
			{/* desctructing the input library from reduxform into that input tag */}
		</div>
	);
};

export default SurveyField;
