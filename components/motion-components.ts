'use client'

import { motion } from "motion/react"
import { Button } from "./ui/button"
import Image from "next/image"
import { LoaderCircle } from "lucide-react"

export const MotionButton = motion.create(Button)
export const MotionImage = motion.create(Image)
export const MotionLoaderCircle = motion.create(LoaderCircle)