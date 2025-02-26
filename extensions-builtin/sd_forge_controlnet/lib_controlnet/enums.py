from __future__ import annotations
from enum import Enum
from typing import List, NamedTuple
from functools import lru_cache


class HiResFixOption(Enum):
    BOTH = "Both"
    LOW_RES_ONLY = "Low res only"
    HIGH_RES_ONLY = "High res only"

    @staticmethod
    def from_value(value) -> "HiResFixOption":
        if isinstance(value, str):
            if value.startswith("HiResFixOption."):
                _, field = value.split(".")
                return getattr(HiResFixOption, field)
            else:
                return HiResFixOption(value)
        elif isinstance(value, int):
            return list(HiResFixOption)[value]
        else:
            assert isinstance(value, HiResFixOption)
            return value

    @property
    def low_res_enabled(self) -> bool:
        return self in (HiResFixOption.BOTH, HiResFixOption.LOW_RES_ONLY)

    @property
    def high_res_enabled(self) -> bool:
        return self in (HiResFixOption.BOTH, HiResFixOption.HIGH_RES_ONLY)


class StableDiffusionVersion(Enum):
    """The version family of stable diffusion model."""

    UNKNOWN = 0
    SD1x = 1
    SD2x = 2
    SDXL = 3

    @staticmethod
    def detect_from_model_name(model_name: str) -> "StableDiffusionVersion":
        """Based on the model name provided, guess what stable diffusion version it is.
        This might not be accurate without actually inspect the file content.
        """
        if any(f"sd{v}" in model_name.lower() for v in ("14", "15", "16")):
            return StableDiffusionVersion.SD1x

        if "sd21" in model_name or "2.1" in model_name:
            return StableDiffusionVersion.SD2x

        if "xl" in model_name.lower():
            return StableDiffusionVersion.SDXL

        return StableDiffusionVersion.UNKNOWN

    def encoder_block_num(self) -> int:
        if self in (StableDiffusionVersion.SD1x, StableDiffusionVersion.SD2x, StableDiffusionVersion.UNKNOWN):
            return 12
        else:
            return 9 # SDXL

    def controlnet_layer_num(self) -> int:
        return self.encoder_block_num() + 1

    def is_compatible_with(self, other: "StableDiffusionVersion") -> bool:
        """ Incompatible only when one of version is SDXL and other is not. """
        return (
            any(v == StableDiffusionVersion.UNKNOWN for v in [self, other]) or
            sum(v == StableDiffusionVersion.SDXL for v in [self, other]) != 1
        )


class InputMode(Enum):
    # Single image to a single ControlNet unit.
    SIMPLE = "simple"
    # Input is a directory. N generations. Each generation takes 1 input image
    # from the directory.
    BATCH = "batch"
    # Input is a directory. 1 generation. Each generation takes N input image
    # from the directory.
    MERGE = "merge"

class ControlModelType(Enum):
    """
    The type of Control Models (supported or not).
    """

    ControlNet = "ControlNet, Lvmin Zhang"
    T2I_Adapter = "T2I_Adapter, Chong Mou"
    T2I_StyleAdapter = "T2I_StyleAdapter, Chong Mou"
    T2I_CoAdapter = "T2I_CoAdapter, Chong Mou"
    MasaCtrl = "MasaCtrl, Mingdeng Cao"
    GLIGEN = "GLIGEN, Yuheng Li"
    AttentionInjection = "AttentionInjection, Lvmin Zhang"  # A simple attention injection written by Lvmin
    StableSR = "StableSR, Jianyi Wang"
    PromptDiffusion = "PromptDiffusion, Zhendong Wang"
    ControlLoRA = "ControlLoRA, Wu Hecong"
    ReVision = "ReVision, Stability"
    IPAdapter = "IPAdapter, Hu Ye"
    Controlllite = "Controlllite, Kohya"
    InstantID = "InstantID, Qixun Wang"
    SparseCtrl = "SparseCtrl, Yuwei Guo"
    ControlNetUnion = "ControlNetUnion, xinsir6"

    @property
    def is_controlnet(self) -> bool:
        """Returns whether the control model should be treated as ControlNet."""
        return self in (
            ControlModelType.ControlNet,
            ControlModelType.ControlLoRA,
            ControlModelType.InstantID,
            ControlModelType.ControlNetUnion,
        )

    @property
    def allow_context_sharing(self) -> bool:
        """Returns whether this control model type allows the same PlugableControlModel
        object map to multiple ControlNetUnit.
        Both IPAdapter and Controlllite have unit specific input (clip/image) stored
        on the model object during inference. Sharing the context means that the input
        set earlier gets lost.
        """
        return self not in (
            ControlModelType.IPAdapter,
            ControlModelType.Controlllite,
        )

    @property
    def supports_effective_region_mask(self) -> bool:
        return (
            self
            in {
                ControlModelType.IPAdapter,
                ControlModelType.T2I_Adapter,
            }
            or self.is_controlnet
        )
    
class AutoMachine(Enum):
    """
    Lvmin's algorithm for Attention/AdaIn AutoMachine States.
    """

    Read = "Read"
    Write = "Write"
    StyleAlign = "StyleAlign"

class UnetBlockType(Enum):
    INPUT = "input"
    OUTPUT = "output"
    MIDDLE = "middle"

class TransformerID(NamedTuple):
    block_type: UnetBlockType
    # The id of the block the transformer is in. Not all blocks have cross attn.
    block_id: int
    # The index of transformer within the block.
    # A block can have multiple transformers in SDXL.
    block_index: int
    # The call index of transformer if in a single step of diffusion.
    transformer_index: int


class TransformerIDResult(NamedTuple):
    input_ids: List[TransformerID]
    output_ids: List[TransformerID]
    middle_ids: List[TransformerID]

    def get(self, idx: int) -> TransformerID:
        return self.to_list()[idx]

    def to_list(self) -> List[TransformerID]:
        return sorted(
            self.input_ids + self.output_ids + self.middle_ids,
            key=lambda i: i.transformer_index,
        )

class PuLIDMode(Enum):
    FIDELITY = "Fidelity"
    STYLE = "Extremely style"

class ControlNetUnionControlType(Enum):
    """
    ControlNet control type for ControlNet union model.
    https://github.com/xinsir6/ControlNetPlus/tree/main
    """

    OPENPOSE = "OpenPose"
    DEPTH = "Depth"
    # hed/pidi/scribble/ted
    SOFT_EDGE = "Soft Edge"
    # canny/lineart/anime_lineart/mlsd
    HARD_EDGE = "Hard Edge"
    NORMAL_MAP = "Normal Map"
    SEGMENTATION = "Segmentation"
    TILE = "Tile"
    INPAINT = "Inpaint"

    UNKNOWN = "Unknown"

    @staticmethod
    def all_tags() -> List[str]:
        """ Tags can be handled by union ControlNet """
        return [
            "openpose",
            "depth",
            "softedge",
            "scribble",
            "canny",
            "lineart",
            "mlsd",
            "normalmap",
            "segmentation",
            "inpaint",
            "tile",
        ]

    @staticmethod
    def from_str(s: str) -> ControlNetUnionControlType:
        s = s.lower()

        if s == "openpose":
            return ControlNetUnionControlType.OPENPOSE
        elif s == "depth":
            return ControlNetUnionControlType.DEPTH
        elif s in ["scribble", "softedge"]:
            return ControlNetUnionControlType.SOFT_EDGE
        elif s in ["canny", "lineart", "mlsd"]:
            return ControlNetUnionControlType.HARD_EDGE
        elif s == "normalmap":
            return ControlNetUnionControlType.NORMAL_MAP
        elif s == "segmentation":
            return ControlNetUnionControlType.SEGMENTATION
        elif s in ["tile", "blur"]:
            return ControlNetUnionControlType.TILE
        elif s == "inpaint":
            return ControlNetUnionControlType.INPAINT

        return ControlNetUnionControlType.UNKNOWN

    def int_value(self) -> int:
        if self == ControlNetUnionControlType.UNKNOWN:
            raise ValueError("Unknown control type cannot be encoded.")

        return list(ControlNetUnionControlType).index(self)