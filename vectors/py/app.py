# Define your vectors here. To run the samples below, 
# from the root directory run:
# $ turbo devserver -p

# then navigate to: 
# http://localhost:3000/vectors/sample

# Deploy the vectors by running from root directory:
# $ turbo functions -p

def sample(event, res):
	data = {
		'confirmation': 'success',
		'data': 'This is a sample one!'
	}

	return res.jsonify(data)

def sample_two(event, res):
	return res.redirect('https://www.turbo360.co')
