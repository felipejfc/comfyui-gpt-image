"""
comfyui-gpt-image
Generate an image by calling gpt-image-1 API
"""

# Define the web directory for JS files
WEB_DIRECTORY = "./js"

from .nodes_api import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']