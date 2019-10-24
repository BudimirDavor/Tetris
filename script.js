window.onload = function() 
{      
	alert('Use arrows if you on PC or use the swipes if you on mobile\n(‹ equals left; › equals right; ˇ equals down; ^ equals rotate) \n\nPress ESC to restart game\n\nScore 50 points to win (~ 15 min)\n\nIn the settings you can change the size of the field')

	setTimeout(function()
	{
		document.getElementById('start-window-text').style.opacity = '1'

		setTimeout(function()
		{
			document.getElementById('start-button').style.opacity = '1'

			setTimeout(function()
			{
				document.getElementById('open-settings-window').style.opacity = '1'

			}, 200)
		}, 200)
	},300);
};