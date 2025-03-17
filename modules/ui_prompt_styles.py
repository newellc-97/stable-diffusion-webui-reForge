import gradio as gr
import re

from modules import shared, ui_common, ui_components, styles

styles_edit_symbol = '\U0001f58c\uFE0F'   # 🖌️
styles_materialize_symbol = '\U0001f4cb'  # 📋
styles_copy_symbol = '\U0001f4dd'         # 📝

useBasePrompt = shared.opts.base_prompt_styles_vars

def select_group(group, name):
    if name == []:
        name = list(shared.prompt_styles.styles)[0]

    style = shared.prompt_styles.styles.get(name)
    existing = style is not None
    empty = not group

    if group == "All":
        return gr.update(choices=list(shared.prompt_styles.styles), value=list(shared.prompt_styles.styles)[0]), gr.update(visible=existing), gr.update(visible=not empty), gr.update(visible=existing), gr.update(visible=existing),

    style_group = []
    for style in shared.prompt_styles.styles:
        if shared.prompt_styles.styles.get(style).group == group:
            style_group.append(style)

    return gr.update(choices=style_group, value=style_group[0]), gr.update(visible=existing), gr.update(visible=not empty), gr.update(visible=existing), gr.update(visible=existing),
 
def select_style(name):
    global useBasePrompt 
    print(f"style: {name}")
    style = shared.prompt_styles.styles.get(name)
    existing = style is not None
    empty = not name

    prompt = style.prompt if style else gr.update()
    negative_prompt = style.negative_prompt if style else gr.update()

    if useBasePrompt:
        base = get_base(prompt)
        parts = get_parts(prompt, base)
        indices = get_indices(parts)
        
        for index in indices:
            print(f"index: {index}")
        
        print("indices length: " + str(len(indices)))
        
        return (
                gr.update(visible=not useBasePrompt), 
                "",
                gr.update(visible=useBasePrompt), 
                gr.update(visible=useBasePrompt),
                base, 
                gr.update(visible=useBasePrompt, choices=indices, value=indices[0]), 
                gr.update(visible=useBasePrompt, value=parts[0]), 
                negative_prompt, 
                gr.update(visible=existing), 
                gr.update(visible=not empty), 
                gr.update(visible=existing), 
                gr.update(visible=existing)
                )
    else:
        return (
            gr.update(visible=not useBasePrompt), 
            prompt,
            gr.update(visible=useBasePrompt), 
            gr.update(visible=useBasePrompt),
            "", 
            gr.update(visible=useBasePrompt, value=[]),
            gr.update(visible=useBasePrompt, value=""), 
            negative_prompt, 
            gr.update(visible=existing), 
            gr.update(visible=not empty), 
            gr.update(visible=existing), 
            gr.update(visible=existing)
            )

def select_base_cbox(name, cbox: gr.SelectData):
    global useBasePrompt 
    useBasePrompt = cbox.selected

    if name == []:
        name = list(shared.prompt_styles.styles)[0]

    style = shared.prompt_styles.styles.get(name)
    existing = style is not None
    empty = not name

    prompt = style.prompt if style else gr.update()
    negative_prompt = style.negative_prompt if style else gr.update()

    if useBasePrompt:
        base = get_base(prompt)
        parts = get_parts(prompt, base)
        indices = get_indices(parts)
        
        return (
            gr.update(visible=not useBasePrompt), 
            "",
            gr.update(visible=useBasePrompt), 
            gr.update(visible=useBasePrompt),
            base, 
            gr.update(visible=useBasePrompt, choices=indices, value=indices[0]), 
            gr.update(visible=useBasePrompt, value=parts[0]),  
            negative_prompt, 
            gr.update(visible=existing), 
            gr.update(visible=not empty), 
            gr.update(visible=existing), 
            gr.update(visible=existing)
            )
    else:
        return (
            gr.update(visible=not useBasePrompt), 
            prompt, 
            gr.update(visible=useBasePrompt), 
            gr.update(visible=useBasePrompt),
            "", 
            gr.update(visible=useBasePrompt, value=[]),
            gr.update(visible=useBasePrompt, value=""), 
            negative_prompt, 
            gr.update(visible=existing), 
            gr.update(visible=not empty), 
            gr.update(visible=existing), 
            gr.update(visible=existing)
            )
    
def select_prompt_part(index, name):
    global useBasePrompt    
    
    print(f"index: {index}")
    if name == []:
        name = list(shared.prompt_styles.styles)[0]

    style = shared.prompt_styles.styles.get(name)

    prompt = style.prompt if style else gr.update()
    negative_prompt = style.negative_prompt if style else gr.update()
    print("test1")
    if not useBasePrompt:
        return (gr.update(visible=useBasePrompt, value=[]), negative_prompt)
    print("test2")
    base = get_base(prompt)
    parts = get_parts(prompt, base)
    print("test3")
    if(int(index) > len(parts) - 1):
        print("test4")
        return(gr.update(visible=useBasePrompt, value="Invalid index"), negative_prompt)
    else:
        print("test5")
        return(gr.update(visible=useBasePrompt, value=str(parts[int(index)])), negative_prompt)

def save_style(name, prompt, negative_prompt):
    if not name:
        return gr.update(visible=False)

    existing_style = shared.prompt_styles.styles.get(name)
    path = existing_style.path if existing_style is not None else None

    style = styles.PromptStyle(name, prompt, negative_prompt, path)
    shared.prompt_styles.styles[style.name] = style
    shared.prompt_styles.save_styles()

    return gr.update(visible=True)

def add_style_to_group(name, prompt, negative_prompt, group):
    if not name:
        return gr.update(visible=False)

    existing_style = shared.prompt_styles.styles.get(name)
    path = existing_style.path if existing_style is not None else None

    style = styles.PromptStyle(name, prompt, negative_prompt, path, group)
    shared.prompt_styles.styles[style.name] = style
    shared.prompt_styles.save_styles()

    return gr.update(visible=True)

def delete_style(name):
    if name == "":
        return

    shared.prompt_styles.styles.pop(name, None)
    shared.prompt_styles.save_styles()

    return '', '', ''


def materialize_styles(prompt, negative_prompt, styles):
    prompt = shared.prompt_styles.apply_styles_to_prompt(prompt, styles)
    negative_prompt = shared.prompt_styles.apply_negative_styles_to_prompt(negative_prompt, styles)

    return [gr.Textbox.update(value=prompt), gr.Textbox.update(value=negative_prompt), gr.Dropdown.update(value=[])]


def refresh_styles():
    return gr.update(choices=list(shared.prompt_styles.styles)), gr.update(choices=list(shared.prompt_styles.styles))


def get_base(prompt):
    re_base = re.compile(r",? *(::)(.*)(::) *,? *", re.I)
    
    if "::" in prompt:
        # Get 'base' text from between ::
        return re_base.split(prompt)[2]
    else:
        return prompt
    
def get_parts(prompt, base):

    print(f"get_parts")
    re_prompt = re.compile(r",? *\{prompt\} *,? *", re.I)
    
    parts = re_prompt.split(prompt)
        
    if len(parts) > 0 and base in parts[0]:
        parts.pop(0)
        
    if len(parts) == 0:
        parts.append("")
        
    return(parts)

def get_indices(parts):
    indices = []
    i = 0
    for part in parts:
        indices.append(i)
        i += 1
        
    return indices


def set_style(dropdown, name):
    if shared.opts.open_to_selected_style:
        if len(dropdown) > 0: 
            return gr.update(value=dropdown[0])

    return gr.update(value=name)
    

# Workaround for Gradio checkbox label+value bug https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/6109
def gradio_enabled_checkbox_workaround():
	return(shared.opts.base_prompt_styles_vars)

class UiPromptStyles:
    def __init__(self, tabname, main_ui_prompt, main_ui_negative_prompt):
        self.tabname = tabname
        self.main_ui_prompt = main_ui_prompt
        self.main_ui_negative_prompt = main_ui_negative_prompt

        with gr.Row(elem_id=f"{tabname}_styles_row"):
            self.dropdown = gr.Dropdown(label="Styles", show_label=False, elem_id=f"{tabname}_styles", choices=list(shared.prompt_styles.styles), value=[], multiselect=True, tooltip="Styles")
            edit_button = ui_components.ToolButton(value=styles_edit_symbol, elem_id=f"{tabname}_styles_edit_button", tooltip="Edit styles")

        with gr.Box(elem_id=f"{tabname}_styles_dialog", elem_classes="popup-dialog") as styles_dialog:
            with gr.Row():
                self.group = gr.Dropdown(label="Groups", elem_id=f"{tabname}_group_filter_select", choices=list(shared.prompt_styles.groups), value=shared.prompt_styles.groups[0], allow_custom_value=True, info="Groups allow you to organize styles by their usage.")
                self.selection = gr.Dropdown(label="Test", elem_id=f"{tabname}_styles_edit_select", choices=list(shared.prompt_styles.styles), value=[], allow_custom_value=True, info="Styles allow you to add custom text to prompt. Use the {prompt} token in style text, and it will be replaced with user's prompt when applying style. Otherwise, style's text will be added to the end of the prompt.")
                ui_common.create_refresh_button([self.dropdown, self.selection], shared.prompt_styles.reload, lambda: {"choices": list(shared.prompt_styles.styles)}, f"refresh_{tabname}_styles")
                self.materialize = ui_components.ToolButton(value=styles_materialize_symbol, elem_id=f"{tabname}_style_apply_dialog", tooltip="Apply all selected styles from the style selection dropdown in main UI to the prompt.")
                self.copy = ui_components.ToolButton(value=styles_copy_symbol, elem_id=f"{tabname}_style_copy", tooltip="Copy main UI prompt to style.")

            with gr.Row():
                self.base_YN = gr.Checkbox(value=gradio_enabled_checkbox_workaround, label="Use Base Prompt", show_label=True, elem_id=f"{tabname}_use_base_prompt")

            with gr.Row(visible=gradio_enabled_checkbox_workaround) as base_prompt_row:
                self.base_prompt = gr.Textbox(label="Base Prompt", show_label=True, elem_id=f"{tabname}_edit_base_prompt", lines=1, elem_classes=["prompt"])
                
                
            # with gr.Row(visible=gradio_enabled_checkbox_workaround) as base_prompt_parts_row_test:
            #     @gr.render(inputs=self.selection)
            #     def prompt_parts(name):
            #         style = shared.prompt_styles.styles.get(name)
            #         prompt = style.prompt if style else gr.update()
            #         base = get_base(prompt)
            #         parts = get_parts(prompt, base)
                    
            #         i = 1
            #         for part in parts:
            #             gr.Button(value=str(i))
            #             gr.Textbox(value=part,elem_id=f"{tabname}_edit_style_prompt", lines=3, elem_classes=["prompt"])
            #             i += 1
           
            with gr.Row(visible=gradio_enabled_checkbox_workaround) as base_prompt_parts_row:  
                self.prompt_index = gr.Dropdown(label="Parts", elem_id=f"{tabname}_style_parts_dropdown", choices=["0", "1", "2"], allow_custom_value=True, interactive=True)
                self.prompt_parts = gr.Textbox(label="Prompt", show_label=True, elem_id=f"{tabname}_style_parts_prompt", lines=1, elem_classes=["prompt"])
                #self.add_part_button = gr.Button('+', variant='primary', elem_id=f'{tabname}_edit_style_add_part')

            with gr.Row(visible=not gradio_enabled_checkbox_workaround) as prompt_row:
                self.prompt = gr.Textbox(label="Prompt", show_label=True, elem_id=f"{tabname}_edit_style_prompt", lines=3, elem_classes=["prompt"])

            with gr.Row():
                self.neg_prompt = gr.Textbox(label="Negative prompt", show_label=True, elem_id=f"{tabname}_edit_style_neg_prompt", lines=3, elem_classes=["prompt"])

            with gr.Row():
                self.save = gr.Button('Save', variant='primary', elem_id=f'{tabname}_edit_style_save', visible=False)
                self.addToGroup = gr.Button('Add to Group:', variant='primary', elem_id=f'{tabname}_edit_style_group_button', visible=False)
                self.groupToAdd = gr.Dropdown(label="Groups", show_label=False, elem_id=f"{tabname}_edit_style_group_dropdown", choices=list(shared.prompt_styles.groups), value=shared.prompt_styles.groups[0], allow_custom_value=True, visible=False)
                self.delete = gr.Button('Delete', variant='primary', elem_id=f'{tabname}_edit_style_delete', visible=False)
                #self.close = gr.Button('Close', variant='primary', elem_id=f'{tabname}_edit_style_close', visible=True)
                

                
        self.group.change(
            fn=select_group,
            inputs=[self.group, self.selection],
            outputs=[self.selection, self.delete, self.save, self.addToGroup, self.groupToAdd],
            show_progress=False,
        )

        self.selection.change(
            fn=select_style,
            inputs=[self.selection],
            outputs=[
                prompt_row, 
                self.prompt,
                base_prompt_row, 
                base_prompt_parts_row, 
                self.base_prompt, 
                self.prompt_index, 
                self.prompt_parts, 
                self.neg_prompt, 
                self.delete, 
                self.save, 
                self.addToGroup, 
                self.groupToAdd
                ],
            show_progress=False,
        )

        self.base_YN.select(
            fn=select_base_cbox,
            inputs=[self.selection],
            outputs=[
                prompt_row,
                self.prompt,
                base_prompt_row, 
                base_prompt_parts_row, 
                self.base_prompt, 
                self.prompt_index, 
                self.prompt_parts, 
                self.neg_prompt, 
                self.delete,
                self.save, 
                self.addToGroup, 
                self.groupToAdd],
            show_progress=False,
        )
        
        self.prompt_index.change(
            fn=select_prompt_part,
            inputs=[self.prompt_index, self.selection],
            outputs=[self.prompt_parts, self.neg_prompt],
            show_progress=False,
        )

        self.save.click(
            fn=save_style,
            inputs=[self.selection, self.prompt, self.neg_prompt],
            outputs=[self.delete],
            show_progress=False,
        ).then(refresh_styles, outputs=[self.dropdown, self.selection], show_progress=False)

        self.addToGroup.click(
            fn=add_style_to_group,
            inputs=[self.selection, self.prompt, self.neg_prompt, self.groupToAdd],
            outputs=[self.delete],
            show_progress=False,
        ).then(refresh_styles, outputs=[self.dropdown, self.selection], show_progress=False)

        self.delete.click(
            fn=delete_style,
            _js='function(name){ if(name == "") return ""; return confirm("Delete style " + name + "?") ? name : ""; }',
            inputs=[self.selection],
            outputs=[self.selection, self.prompt, self.neg_prompt],
            show_progress=False,
        ).then(refresh_styles, outputs=[self.dropdown, self.selection], show_progress=False)

        self.setup_apply_button(self.materialize)

        self.copy.click(
            fn=lambda p, n: (p, n),
            inputs=[main_ui_prompt, main_ui_negative_prompt],
            outputs=[self.prompt, self.neg_prompt],
            show_progress=False,
        )
        
        edit_button.click(
            fn=set_style,
            inputs=[self.dropdown, self.selection],
            outputs=[self.selection]        
        )

        ui_common.setup_dialog(button_show=edit_button, dialog=styles_dialog)

    def setup_apply_button(self, button):
        button.click(
            fn=materialize_styles,
            inputs=[self.main_ui_prompt, self.main_ui_negative_prompt, self.dropdown],
            outputs=[self.main_ui_prompt, self.main_ui_negative_prompt, self.dropdown],
            show_progress=False,
        ).then(fn=None, _js="function(){update_"+self.tabname+"_tokens(); closePopup();}", show_progress=False)
