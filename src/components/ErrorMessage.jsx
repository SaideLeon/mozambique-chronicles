import React from 'react';

export const ErrorMessage = ({error}) => {
	return(
	  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
		)
}